import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertCustomerSchema, updateMenuItemFlagsSchema, insertReservationSchema, insertOrderSchema, favoriteItemSchema } from "@shared/schema";
import crypto from "crypto";

function getAdminToken() {
  return process.env.ADMIN_API_TOKEN || (process.env.NODE_ENV !== "production" ? "admin123" : "");
}

function isAuthorizedAdmin(authHeader: string | undefined) {
  const token = getAdminToken();
  return Boolean(token && authHeader === `Bearer ${token}`);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // QR tokens are base64url(payload).base64url(HMAC-SHA256(payload)).
  app.get("/api/qr-context/:token", (req, res) => {
    try {
      const secret = process.env.SESSION_SECRET;
      if (!secret) return res.status(503).json({ message: "QR validation unavailable" });
      const token = req.params.token;
      const [encoded, signature] = token.split(".");
      if (!encoded || !signature) return res.status(400).json({ message: "Invalid QR token" });
      const expected = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ message: "Invalid QR token" });
      }
      const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
      if (!payload.tableName || !payload.floorName) return res.status(400).json({ message: "Incomplete QR token" });
      res.json({ tableName: String(payload.tableName), floorName: String(payload.floorName) });
    } catch {
      res.status(400).json({ message: "Invalid QR token" });
    }
  });
  // Customer routes
  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const result = await storage.createOrUpdateCustomer(validatedData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.get("/api/customers", async (req, res) => {
    // Basic auth for admin view (should be more robust in production)
    const authHeader = req.headers.authorization;
    if (!isAuthorizedAdmin(authHeader)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;
      const dateFrom = req.query.dateFrom as string;
      const dateTo = req.query.dateTo as string;

      const allCustomers = await storage.getCustomers();
      
      // Filtering
      let filtered = allCustomers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.contactNumber.includes(search);
        
        let matchesDate = true;
        if (dateFrom || dateTo) {
          const visitDate = new Date(c.createdAt);
          // Format visit date as YYYY-MM-DD for string comparison
          const vYear = visitDate.getFullYear();
          const vMonth = String(visitDate.getMonth() + 1).padStart(2, '0');
          const vDay = String(visitDate.getDate()).padStart(2, '0');
          const visitDateString = `${vYear}-${vMonth}-${vDay}`;

          if (dateFrom) {
            // dateFrom is already in YYYY-MM-DD format from frontend
            if (visitDateString < dateFrom) matchesDate = false;
          }
          if (dateTo) {
            // dateTo is already in YYYY-MM-DD format from frontend
            if (visitDateString > dateTo) matchesDate = false;
          }
        }
        
        return matchesSearch && matchesDate;
      });

      // Sorting
      filtered.sort((a: any, b: any) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return -1 * sortOrder;
        if (valA > valB) return 1 * sortOrder;
        return 0;
      });

      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      res.json({
        customers: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Fetch a single customer's full profile (favorites, visit stats, etc.) by phone
  app.get("/api/customers/by-phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      res.set("Cache-Control", "no-store");
      const customer = await storage.getCustomerByPhone(phone);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // Toggle a menu item in/out of a customer's favorites
  app.post("/api/customers/:phone/favorites/toggle", async (req, res) => {
    try {
      const { phone } = req.params;
      const validated = favoriteItemSchema.parse(req.body);
      const updated = await storage.toggleFavorite(phone, validated);
      if (!updated) return res.status(404).json({ message: "Customer not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  // Menu items routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const categoryQuery = (req.query.category as string) || (req.params as any).category;
      console.log(`[API] Fetching menu items for category: ${categoryQuery}`);

      if (categoryQuery) {
        const items = await storage.getMenuItemsByCategory(categoryQuery);
        return res.json(items);
      }

      // No category param, return all items
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  // Update todaysSpecial / chefSpecial / isAvailable flags on a menu item
  app.patch("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { category, ...flagsBody } = req.body;
      if (!category) return res.status(400).json({ message: "category is required" });
      const flags = updateMenuItemFlagsSchema.parse(flagsBody);
      const updated = await storage.updateMenuItemFlags(id, category, flags);
      if (!updated) return res.status(404).json({ message: "Menu item not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      await storage.clearCart();
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Welcome screen UI route
  app.get("/api/welcome-screen-ui", async (req, res) => {
    try {
      const ui = await storage.getWelcomeScreenUI();
      if (!ui) return res.status(404).json({ message: "Welcome screen UI not found" });
      res.json(ui);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch welcome screen UI" });
    }
  });

  // Carousel images route
  app.get("/api/carousel", async (req, res) => {
    try {
      const images = await storage.getCarouselImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  // Coupons route — returns only coupons with show: true
  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  // Logo route
  app.get("/api/logo", async (req, res) => {
    try {
      const logo = await storage.getLogo();
      if (!logo) return res.status(404).json({ message: "Logo not found" });
      res.json(logo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logo" });
    }
  });

  // Social links route
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      if (!links) return res.status(404).json({ message: "Social links not found" });
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  app.patch("/api/social-links", async (req, res) => {
    try {
      const updated = await storage.updateSocialLinks(req.body);
      if (!updated) return res.status(404).json({ message: "Social links not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update social links" });
    }
  });

  // Get categories — returns actual categories from DB (menupage.categories)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get menu categories (dynamic, from DB)
  app.get("/api/menu-categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  // Smart picks categories (dynamic tabs from DB)
  app.get("/api/smart-picks-categories", async (req, res) => {
    try {
      const categories = await storage.getSmartPicksCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch smart picks categories" });
    }
  });

  // Update visibility flag for a smart picks category
  app.patch("/api/smart-picks-categories/:key/visibility", async (req, res) => {
    try {
      const { key } = req.params;
      const { isVisible } = req.body;
      if (typeof isVisible !== "boolean") {
        return res.status(400).json({ message: "isVisible must be a boolean" });
      }
      const updated = await storage.updateSmartPicksCategoryVisibility(key, isVisible);
      if (!updated) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category visibility" });
    }
  });

  // Reservation routes
  app.post("/api/reservations", async (req, res) => {
    try {
      const validated = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validated);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Invalid reservation data" });
    }
  });

  app.get("/api/reservations", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!isAuthorizedAdmin(authHeader)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Call waiter routes
  app.get("/api/call-waiter", async (req, res) => {
    try {
      const status = await storage.getCallWaiterStatus();
      res.json(status ?? { called: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call waiter status" });
    }
  });

  app.patch("/api/call-waiter", async (req, res) => {
    try {
      const { called } = req.body;
      if (typeof called !== "boolean") return res.status(400).json({ message: "'called' must be a boolean" });
      const status = await storage.setCallWaiterStatus(called);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to update call waiter status" });
    }
  });

  // Payment details route
  app.get("/api/payment-details", async (req, res) => {
    try {
      const details = await storage.getPaymentDetails();
      if (!details) return res.status(404).json({ message: "Payment details not found" });
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment details" });
    }
  });

  // Restaurant info routes
  app.get("/api/restaurant-info", async (req, res) => {
    try {
      const info = await storage.getRestaurantInfo();
      if (!info) return res.status(404).json({ message: "Restaurant info not found" });
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant info" });
    }
  });

  app.patch("/api/restaurant-info", async (req, res) => {
    try {
      const updated = await storage.updateRestaurantInfo(req.body);
      if (!updated) return res.status(404).json({ message: "Restaurant info not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update restaurant info" });
    }
  });

  // Offer tile images routes
  app.get("/api/offer-tile-images", async (req, res) => {
    try {
      const images = await storage.getOfferTileImages();
      if (!images) return res.status(404).json({ message: "Offer tile images not found" });
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offer tile images" });
    }
  });

  app.patch("/api/offer-tile-images", async (req, res) => {
    try {
      const updated = await storage.updateOfferTileImages(req.body);
      if (!updated) return res.status(404).json({ message: "Offer tile images not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer tile images" });
    }
  });

  // Fix veg/non-veg classification
  app.post("/api/fix-veg-classification", async (req, res) => {
    try {
      const result = await storage.fixVegNonVegClassification();
      res.json({
        message: `Fixed ${result.updated} items`,
        updated: result.updated,
        details: result.details
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fix veg classification" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = req.body.mergeExisting
        ? await storage.addItemsToOngoingOrder(validated) ?? await storage.createOrder(validated)
        : await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/by-phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      res.set("Cache-Control", "no-store");
      const customerOrders = await storage.getOrdersByPhone(phone);
      res.json(customerOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  // Shared ongoing orders for everyone currently using the same table.
  // This intentionally does not filter by customer phone: guests at one table
  // must see the table's complete active order as it changes.
  app.get("/api/orders/by-table", async (req, res) => {
    try {
      const tableId = String(req.query.tableId || "");
      const floorId = String(req.query.floorId || "Ground Floor");
      if (!tableId) return res.status(400).json({ message: "tableId is required" });
      res.set("Cache-Control", "no-store");
      res.json(await storage.getActiveOrdersByTable(tableId, floorId));
    } catch {
      res.status(500).json({ message: "Failed to fetch table orders" });
    }
  });

  // POS settings (tax rate, service charge)
  app.get("/api/pos-settings", async (req, res) => {
    try {
      const settings = await storage.getPosSettings();
      res.setHeader("Cache-Control", "no-store");
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch POS settings" });
    }
  });

  // Update order status (e.g. mark as completed)
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["pending", "confirmed", "preparing", "ready", "served", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const updated = await storage.updateOrderStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Delete a customer's completed/cancelled order history (ongoing orders are preserved)
  app.delete("/api/orders/by-phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const deletedCount = await storage.deleteCompletedOrdersByPhone(phone);
      res.json({ deletedCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
