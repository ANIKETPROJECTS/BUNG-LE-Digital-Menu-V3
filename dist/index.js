// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { MongoClient, ObjectId } from "mongodb";
var MongoStorage = class {
  client;
  db;
  customersDb;
  socialsDb;
  welcomeScreenDb;
  menuPageDb;
  hamburgerDb;
  categoryCollections;
  cartItemsCollection;
  usersCollection;
  customersCollection;
  linksCollection;
  welcomeScreenUiCollection;
  couponsCollection;
  carouselCollection;
  logoCollection;
  categoriesCollection;
  reservationCollection;
  paymentDetailsCollection;
  callWaiterCollection;
  restaurantInfoCollection;
  smartpicksDb;
  smartpicksCategorieCollection;
  offerTileImagesCollection;
  ordersDb;
  ordersCollection;
  posDb;
  posSettingsCollection;
  restaurantId;
  categories = [
    // FOOD
    "soups",
    "khane-peene",
    "continental-veg",
    "continental-non-veg",
    "pasta",
    "pizza",
    "tandoor-veg",
    "tandoor-non-veg",
    "oriental-starter-veg",
    "oriental-starter-non-veg",
    "jalpari-special",
    "sabzi-tarkari",
    "murg-e-khaas",
    "gosht-e-khaas",
    "agri-style",
    "rotis",
    "oriental-curries",
    "fried-rice-noodles",
    "basmati-ki-khushbu",
    "dals",
    "salad-raita",
    "desserts",
    // USER-CREATED MENU CATEGORIES
    "nonveg-rice",
    "soup-veg-starters",
    "nonveg-starters-appetizers",
    "nonveg-noodle-veg-rice",
    // BAR
    "cocktails",
    "shots",
    "beer",
    "alcopops",
    "wine",
    "liquor",
    "beverages",
    "whisky",
    "single-malt",
    "bourbon-irish",
    "vodka",
    "gin",
    "rum",
    "brandy",
    // MOCKTAILS
    "mocktails-drinks",
    // OFFER ITEMS
    "offer-cocktails",
    "offer-mocktails"
  ];
  constructor(connectionString2) {
    this.client = new MongoClient(connectionString2);
    this.db = this.client.db("bungle");
    this.customersDb = this.client.db("customersdb");
    this.socialsDb = this.client.db("socialsandcontact");
    this.welcomeScreenDb = this.client.db("welcomescreen");
    this.menuPageDb = this.client.db("menupage");
    this.hamburgerDb = this.client.db("hamburger");
    this.categoryCollections = /* @__PURE__ */ new Map();
    this.categories.forEach((category) => {
      this.categoryCollections.set(category, this.db.collection(category));
    });
    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.customersCollection = this.customersDb.collection("customers");
    this.linksCollection = this.socialsDb.collection("link");
    this.welcomeScreenUiCollection = this.welcomeScreenDb.collection("welcomescreenui");
    this.couponsCollection = this.menuPageDb.collection("coupons");
    this.carouselCollection = this.menuPageDb.collection("carousel");
    this.logoCollection = this.menuPageDb.collection("logo");
    this.categoriesCollection = this.menuPageDb.collection("categories");
    this.reservationCollection = this.hamburgerDb.collection("reservation");
    this.paymentDetailsCollection = this.hamburgerDb.collection("paymentdetails");
    this.callWaiterCollection = this.menuPageDb.collection("callwaiter");
    this.restaurantInfoCollection = this.hamburgerDb.collection("restaurantinfo");
    this.smartpicksDb = this.client.db("smartpicks");
    this.smartpicksCategorieCollection = this.smartpicksDb.collection("smartpickscategorie");
    this.offerTileImagesCollection = this.menuPageDb.collection("offertileimages");
    this.ordersDb = this.client.db("Orders");
    this.ordersCollection = this.ordersDb.collection("orders");
    this.posDb = this.client.db("POS");
    this.posSettingsCollection = this.posDb.collection("settings");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }
  async connect() {
    await this.client.connect();
    const existingCollections = await this.db.listCollections().toArray();
    const existingNames = existingCollections.map((c) => c.name);
    for (const category of this.categories) {
      if (!existingNames.includes(category)) {
        console.log(`[Storage] Creating missing collection: ${category}`);
        await this.db.createCollection(category);
      }
    }
    const customerCollections = await this.customersDb.listCollections().toArray();
    const customerExistingNames = customerCollections.map((c) => c.name);
    if (!customerExistingNames.includes("customers")) {
      console.log(`[Storage] Creating missing collection: customers in customersdb`);
      await this.customersDb.createCollection("customers");
    }
    const socialsCollections = await this.socialsDb.listCollections().toArray();
    const socialsExistingNames = socialsCollections.map((c) => c.name);
    if (!socialsExistingNames.includes("link")) {
      console.log(`[Storage] Creating missing collection: link in socialsandcontact`);
      await this.socialsDb.createCollection("link");
    }
    const welcomeCollections = await this.welcomeScreenDb.listCollections().toArray();
    const welcomeExistingNames = welcomeCollections.map((c) => c.name);
    if (!welcomeExistingNames.includes("welcomescreenui")) {
      console.log(`[Storage] Creating missing collection: welcomescreenui in welcomescreen`);
      await this.welcomeScreenDb.createCollection("welcomescreenui");
    }
    const menuPageCollections = await this.menuPageDb.listCollections().toArray();
    const menuPageExistingNames = menuPageCollections.map((c) => c.name);
    if (!menuPageExistingNames.includes("coupons")) {
      console.log(`[Storage] Creating missing collection: coupons in menupage`);
      await this.menuPageDb.createCollection("coupons");
    }
    if (!menuPageExistingNames.includes("carousel")) {
      console.log(`[Storage] Creating missing collection: carousel in menupage`);
      await this.menuPageDb.createCollection("carousel");
    }
    const carouselMigrated = await this.carouselCollection.updateMany(
      { visible: { $exists: false } },
      { $set: { visible: true } }
    );
    if (carouselMigrated.modifiedCount > 0) {
      console.log(`[Storage] Migrated ${carouselMigrated.modifiedCount} carousel documents to add visible: true`);
    }
    if (!menuPageExistingNames.includes("logo")) {
      console.log(`[Storage] Creating missing collection: logo in menupage`);
      await this.menuPageDb.createCollection("logo");
    }
    if (!menuPageExistingNames.includes("categories")) {
      console.log(`[Storage] Creating missing collection: categories in menupage`);
      await this.menuPageDb.createCollection("categories");
    }
    {
      const allCats = await this.categoriesCollection.find({}).toArray();
      let migrated = 0;
      for (const cat of allCats) {
        const updates = {};
        if (cat.visible === void 0 || cat.visible === null) {
          updates.visible = true;
        }
        const { changed: subsChanged, result: updatedSubcats } = this.addVisibilityToSubcats(cat.subcategories || []);
        if (subsChanged) {
          updates.subcategories = updatedSubcats;
        }
        if (Object.keys(updates).length > 0) {
          await this.categoriesCollection.updateOne({ _id: cat._id }, { $set: updates });
          migrated++;
        }
      }
      if (migrated > 0) {
        console.log(`[Storage] Migrated ${migrated} category documents to add visible: true`);
      }
    }
    if (!menuPageExistingNames.includes("callwaiter")) {
      console.log(`[Storage] Creating missing collection: callwaiter in menupage`);
      await this.menuPageDb.createCollection("callwaiter");
    }
    const hamburgerCollections = await this.hamburgerDb.listCollections().toArray();
    const hamburgerExistingNames = hamburgerCollections.map((c) => c.name);
    if (!hamburgerExistingNames.includes("reservation")) {
      console.log(`[Storage] Creating missing collection: reservation in hamburger`);
      await this.hamburgerDb.createCollection("reservation");
    }
    if (!hamburgerExistingNames.includes("paymentdetails")) {
      console.log(`[Storage] Creating missing collection: paymentdetails in hamburger`);
      await this.hamburgerDb.createCollection("paymentdetails");
    }
    if (!hamburgerExistingNames.includes("restaurantinfo")) {
      console.log(`[Storage] Creating missing collection: restaurantinfo in hamburger`);
      await this.hamburgerDb.createCollection("restaurantinfo");
    }
    const smartpicksCollections = await this.smartpicksDb.listCollections().toArray();
    const smartpicksExistingNames = smartpicksCollections.map((c) => c.name);
    if (!smartpicksExistingNames.includes("smartpickscategorie")) {
      console.log(`[Storage] Creating missing collection: smartpickscategorie in smartpicks`);
      await this.smartpicksDb.createCollection("smartpickscategorie");
    }
    await this.smartpicksCategorieCollection.updateMany(
      { isVisible: { $exists: false } },
      { $set: { isVisible: true } }
    );
    if (!menuPageExistingNames.includes("offertileimages")) {
      console.log(`[Storage] Creating missing collection: offertileimages in menupage`);
      await this.menuPageDb.createCollection("offertileimages");
    }
    const ordersCollections = await this.ordersDb.listCollections().toArray();
    const ordersExistingNames = ordersCollections.map((c) => c.name);
    if (!ordersExistingNames.includes("orders")) {
      console.log(`[Storage] Creating missing collection: orders in Orders`);
      await this.ordersDb.createCollection("orders");
    }
    await this.syncSmartPicksFlags();
    this.watchSmartPicksCategories();
  }
  async getOfferTileImages() {
    return await this.offerTileImagesCollection.findOne({});
  }
  async updateOfferTileImages(data) {
    const existing = await this.offerTileImagesCollection.findOne({});
    if (!existing) return null;
    const updated = await this.offerTileImagesCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: "after" }
    );
    return updated;
  }
  async getSocialLinks() {
    return await this.linksCollection.findOne({});
  }
  async updateSocialLinks(data) {
    const existing = await this.linksCollection.findOne({});
    if (!existing) return null;
    const updated = await this.linksCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: "after" }
    );
    return updated;
  }
  async getWelcomeScreenUI() {
    return await this.welcomeScreenUiCollection.findOne({});
  }
  async getCoupons() {
    return await this.couponsCollection.find({ show: true }).toArray();
  }
  async getCarouselImages() {
    return await this.carouselCollection.find({ visible: true }).sort({ order: 1 }).toArray();
  }
  async getLogo() {
    return await this.logoCollection.findOne({});
  }
  async getSmartPicksCategories() {
    return await this.smartpicksCategorieCollection.find({ isVisible: true }).sort({ order: 1 }).toArray();
  }
  async updateSmartPicksCategoryVisibility(key, isVisible) {
    await this.smartpicksCategorieCollection.updateOne({ key }, { $set: { isVisible } });
    return await this.smartpicksCategorieCollection.findOne({ key });
  }
  async syncSmartPicksFlags() {
    const cats = await this.smartpicksCategorieCollection.find({}).toArray();
    const currentKeys = cats.map((c) => c.key);
    const metaCollection = this.smartpicksDb.collection("metadata");
    const meta = await metaCollection.findOne({ _id: "managedKeys" });
    const previousKeys = meta?.keys ?? [];
    const keysToAdd = currentKeys.filter((k) => !previousKeys.includes(k));
    const keysToRemove = previousKeys.filter((k) => !currentKeys.includes(k));
    if (keysToAdd.length === 0 && keysToRemove.length === 0) return;
    const allCollections = Array.from(this.categoryCollections.values());
    for (const col of allCollections) {
      for (const key of keysToAdd) {
        await col.updateMany({ [key]: { $exists: false } }, { $set: { [key]: false } });
      }
      if (keysToRemove.length > 0) {
        const unset = {};
        keysToRemove.forEach((k) => {
          unset[k] = "";
        });
        await col.updateMany({}, { $unset: unset });
      }
    }
    await metaCollection.updateOne(
      { _id: "managedKeys" },
      { $set: { keys: currentKeys } },
      { upsert: true }
    );
    if (keysToAdd.length > 0) {
      console.log(`[SmartPicks] Added flag "${keysToAdd.join(", ")}" to all menu items`);
    }
    if (keysToRemove.length > 0) {
      console.log(`[SmartPicks] Removed flag "${keysToRemove.join(", ")}" from all menu items`);
    }
  }
  watchSmartPicksCategories() {
    const changeStream = this.smartpicksCategorieCollection.watch([], { fullDocument: "updateLookup" });
    changeStream.on("change", async () => {
      try {
        await this.syncSmartPicksFlags();
      } catch (err) {
        console.error("[SmartPicks] Failed to sync flags after change:", err);
      }
    });
    changeStream.on("error", (err) => {
      console.error("[SmartPicks] Change stream error:", err);
    });
    console.log("[SmartPicks] Watching smartpickscategorie for changes...");
  }
  addVisibilityToSubcats(subcats) {
    let changed = false;
    const result = subcats.map((sub) => {
      const updated = { ...sub };
      if (updated.visible === void 0 || updated.visible === null) {
        updated.visible = true;
        changed = true;
      }
      if (sub.subcategories?.length) {
        const { changed: childChanged, result: childResult } = this.addVisibilityToSubcats(sub.subcategories);
        if (childChanged) {
          updated.subcategories = childResult;
          changed = true;
        }
      }
      return updated;
    });
    return { changed, result };
  }
  filterVisibleSubcats(subcats) {
    return subcats.filter((sub) => sub.visible !== false).map((sub) => ({
      ...sub,
      subcategories: this.filterVisibleSubcats(sub.subcategories || [])
    }));
  }
  async getMenuCategories() {
    const all = await this.categoriesCollection.find({}).sort({ order: 1 }).toArray();
    return all.filter((cat) => cat.visible !== false).map((cat) => ({
      ...cat,
      subcategories: this.filterVisibleSubcats(cat.subcategories || [])
    }));
  }
  async getUser(id) {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user || void 0;
  }
  async getUserByUsername(username) {
    const user = await this.usersCollection.findOne({ username });
    return user || void 0;
  }
  async createUser(insertUser) {
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, createdAt: now, updatedAt: now };
    const result = await this.usersCollection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }
  async getCustomers() {
    return await this.customersCollection.find({}).sort({ createdAt: -1 }).toArray();
  }
  async getCustomerByPhone(phone) {
    const customer = await this.customersCollection.findOne({ contactNumber: phone });
    return customer || void 0;
  }
  async createOrUpdateCustomer(insertCustomer) {
    const existing = await this.getCustomerByPhone(insertCustomer.contactNumber);
    const now = /* @__PURE__ */ new Date();
    if (existing) {
      const lastVisit = existing.lastVisitDate ? new Date(existing.lastVisitDate) : null;
      const isSameDay = lastVisit && lastVisit.getFullYear() === now.getFullYear() && lastVisit.getMonth() === now.getMonth() && lastVisit.getDate() === now.getDate();
      const updateData = {
        name: insertCustomer.name,
        updatedAt: now,
        lastVisitDate: now
      };
      if (!isSameDay) {
        updateData.$inc = { visitCount: 1 };
      }
      let updateOperation;
      if (updateData.$inc) {
        const { $inc, ...setFields } = updateData;
        updateOperation = { $set: setFields, $inc };
      } else {
        updateOperation = { $set: updateData };
      }
      const updated = await this.customersCollection.findOneAndUpdate(
        { _id: existing._id },
        updateOperation,
        { returnDocument: "after" }
      );
      return { customer: updated, isNew: false };
    }
    const customer = {
      ...insertCustomer,
      visitCount: 1,
      lastVisitDate: now,
      createdAt: now,
      updatedAt: now
    };
    const result = await this.customersCollection.insertOne(customer);
    return { customer: { _id: result.insertedId, ...customer }, isNew: true };
  }
  async toggleFavorite(phone, item) {
    const existing = await this.getCustomerByPhone(phone);
    if (!existing) return void 0;
    const pullResult = await this.customersCollection.updateOne(
      { _id: existing._id, "favorites.menuItemId": item.menuItemId },
      { $pull: { favorites: { menuItemId: item.menuItemId } }, $set: { updatedAt: /* @__PURE__ */ new Date() } }
    );
    if (pullResult.modifiedCount === 0) {
      const favorite = { ...item, addedAt: /* @__PURE__ */ new Date() };
      await this.customersCollection.updateOne(
        { _id: existing._id, "favorites.menuItemId": { $ne: item.menuItemId } },
        { $push: { favorites: favorite }, $set: { updatedAt: /* @__PURE__ */ new Date() } }
      );
    }
    return await this.getCustomerByPhone(phone);
  }
  async getMenuItems() {
    const allMenuItems = [];
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const items = await collection.find({}).toArray();
      allMenuItems.push(...items);
    }
    return this.sortMenuItems(allMenuItems);
  }
  async getMenuItemsByCategory(category) {
    console.log(`[Storage] Fetching items for category: ${category}`);
    try {
      let collection = this.db.collection(category);
      let items = await collection.find({}).toArray();
      if (items.length > 0) {
        console.log(`[Storage] Found ${items.length} items in bungle.${category}`);
        return this.sortMenuItems(items.map((item) => ({ ...item, category })));
      }
      const variations = [
        category,
        category.replace(/-/g, " "),
        category.replace(/-/g, "&"),
        category.replace(/-/g, " & "),
        category.replace(/&/g, "-"),
        category.replace(/ /g, "-")
      ];
      for (const variant of Array.from(new Set(variations))) {
        if (variant === category) continue;
        const variantColl = this.db.collection(variant);
        const variantItems = await variantColl.find({}).toArray();
        if (variantItems.length > 0) {
          console.log(`[Storage] Found ${variantItems.length} items in bungle collection variation: ${variant}`);
          return this.sortMenuItems(variantItems.map((item) => ({ ...item, category: variant })));
        }
      }
      const dbCollections = await this.db.listCollections().toArray();
      const allMatches = [];
      for (const collInfo of dbCollections) {
        const coll = this.db.collection(collInfo.name);
        const matches = await coll.find({
          $or: [
            { name: new RegExp(category.replace(/-/g, " "), "i") },
            { description: new RegExp(category.replace(/-/g, " "), "i") }
          ]
        }).toArray();
        if (matches.length > 0) allMatches.push(...matches.map((m) => ({ ...m, category: collInfo.name })));
      }
      if (allMatches.length > 0) return this.sortMenuItems(allMatches);
      return [];
    } catch (error) {
      console.error(`[Storage] Error fetching items for ${category}:`, error);
      return [];
    }
  }
  async getMenuItem(id) {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      const menuItem = await collection.findOne({ _id: new ObjectId(id) });
      if (menuItem) return menuItem;
    }
    return void 0;
  }
  getCategories() {
    return [...this.categories];
  }
  async addMenuItem(item) {
    const collection = this.db.collection(item.category);
    const now = /* @__PURE__ */ new Date();
    const menuItem = { ...item, restaurantId: this.restaurantId, createdAt: now, updatedAt: now, __v: 0 };
    const result = await collection.insertOne(menuItem);
    return { _id: result.insertedId, ...menuItem };
  }
  async updateMenuItemFlags(id, category, flags) {
    const collection = this.db.collection(category);
    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...flags, updatedAt: /* @__PURE__ */ new Date() } },
      { returnDocument: "after" }
    );
    return updated || void 0;
  }
  async getCartItems() {
    return await this.cartItemsCollection.find({}).toArray();
  }
  async addToCart(item) {
    const menuItemId = new ObjectId(item.menuItemId);
    const existing = await this.cartItemsCollection.findOne({ menuItemId });
    if (existing) {
      const updated = await this.cartItemsCollection.findOneAndUpdate(
        { _id: existing._id },
        { $inc: { quantity: item.quantity || 1 }, $set: { updatedAt: /* @__PURE__ */ new Date() } },
        { returnDocument: "after" }
      );
      return updated;
    }
    const now = /* @__PURE__ */ new Date();
    const cartItem = { menuItemId, quantity: item.quantity || 1, createdAt: now, updatedAt: now };
    const result = await this.cartItemsCollection.insertOne(cartItem);
    return { _id: result.insertedId, ...cartItem };
  }
  async removeFromCart(id) {
    await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
  }
  async clearCart() {
    await this.cartItemsCollection.deleteMany({});
  }
  async createReservation(reservation) {
    const now = /* @__PURE__ */ new Date();
    const doc = { ...reservation, createdAt: now };
    const result = await this.reservationCollection.insertOne(doc);
    return { _id: result.insertedId, ...doc };
  }
  async getReservations() {
    return await this.reservationCollection.find({}).sort({ createdAt: -1 }).toArray();
  }
  async getPaymentDetails() {
    return await this.paymentDetailsCollection.findOne({});
  }
  async getRestaurantInfo() {
    return await this.restaurantInfoCollection.findOne({});
  }
  async updateRestaurantInfo(data) {
    const existing = await this.restaurantInfoCollection.findOne({});
    if (!existing) return null;
    const updated = await this.restaurantInfoCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: "after" }
    );
    return updated;
  }
  async getCallWaiterStatus() {
    return await this.callWaiterCollection.findOne({});
  }
  async setCallWaiterStatus(called) {
    const existing = await this.callWaiterCollection.findOne({});
    if (existing) {
      const updated = await this.callWaiterCollection.findOneAndUpdate(
        { _id: existing._id },
        { $set: { called } },
        { returnDocument: "after" }
      );
      return updated;
    }
    const result = await this.callWaiterCollection.insertOne({ called });
    return { _id: result.insertedId, called };
  }
  async createOrder(order) {
    const now = /* @__PURE__ */ new Date();
    const tableNumber = order.tableNumber ?? order.tableId.replace(/^table\s*/i, "T").replace(/^T(\d)$/i, "T$1");
    const doc = {
      ...order,
      tableNumber,
      floorId: order.floorId ?? "Ground Floor",
      orderType: order.orderType ?? "dine-in",
      paymentStatus: order.paymentStatus ?? "pending",
      paymentMode: order.paymentMode ?? null,
      customerEmail: order.customerEmail ?? null,
      customerAddress: order.customerAddress ?? null,
      items: order.items.map((item) => ({
        ...item,
        isVeg: item.isVeg ?? true,
        notes: item.notes ?? null
      })),
      createdAt: now
    };
    const result = await this.ordersCollection.insertOne(doc);
    return { _id: result.insertedId, ...doc };
  }
  async getOrders() {
    return await this.ordersCollection.find({}).sort({ createdAt: -1 }).toArray();
  }
  async getOrdersByPhone(phone) {
    return await this.ordersCollection.find({ customerPhone: phone }).sort({ createdAt: -1 }).toArray();
  }
  async deleteCompletedOrdersByPhone(phone) {
    const result = await this.ordersCollection.deleteMany({
      customerPhone: phone,
      status: { $in: ["completed", "cancelled"] }
    });
    return result.deletedCount ?? 0;
  }
  async clearDatabase() {
    const collections = Array.from(this.categoryCollections.values());
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
  async fixVegNonVegClassification() {
    return { updated: 0, details: [] };
  }
  async getPosSettings() {
    const docs = await this.posSettingsCollection.find({}).toArray();
    const map = {};
    for (const doc of docs) map[doc.key] = doc.value;
    return {
      taxRate: parseFloat(map["tax_rate"] ?? "0"),
      serviceCharge: parseFloat(map["service_charge"] ?? "0"),
      gstEnabled: (map["gst_enabled"] ?? "false") === "true",
      gstNumber: map["gst_number"] ?? ""
    };
  }
  sortMenuItems(items) {
    return items.sort((a, b) => {
      if (a.isVeg !== b.isVeg) return a.isVeg ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
};
var connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  throw new Error("MONGODB_URI environment variable is required");
}
var storage = new MongoStorage(connectionString);

// shared/schema.ts
import { z } from "zod";
var insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string().min(1)]),
  // Support both number and string prices
  category: z.string().min(1),
  isVeg: z.boolean(),
  image: z.string().url(),
  restaurantId: z.string().optional(),
  isAvailable: z.boolean().default(true),
  todaysSpecial: z.boolean().default(false),
  chefSpecial: z.boolean().default(false),
  preparationTime: z.string().optional(),
  nutritionalContents: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional()
});
var updateMenuItemFlagsSchema = z.object({
  todaysSpecial: z.boolean().optional(),
  chefSpecial: z.boolean().optional(),
  isAvailable: z.boolean().optional()
});
var insertCartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().positive().default(1)
});
var insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});
var insertCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),
  visitCount: z.number().optional().default(1),
  lastVisitDate: z.date().optional()
});
var favoriteItemSchema = z.object({
  menuItemId: z.string().min(1),
  name: z.string().min(1),
  price: z.union([z.number(), z.string()]),
  image: z.string().optional().default(""),
  category: z.string().optional().default(""),
  isVeg: z.boolean().optional()
});
var insertReservationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10).max(10),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  guests: z.string().min(1),
  occasion: z.string().optional()
});
var insertOrderSchema = z.object({
  tableId: z.string().default("Table1"),
  tableNumber: z.string().optional(),
  floorId: z.string().optional().default("Ground Floor"),
  orderType: z.enum(["dine-in", "delivery", "pickup"]).default("dine-in"),
  items: z.array(z.object({
    name: z.string(),
    price: z.union([z.number(), z.string()]),
    quantity: z.number().positive(),
    category: z.string(),
    isVeg: z.boolean().optional(),
    notes: z.string().nullable().optional()
  })).min(1),
  total: z.number().nonnegative(),
  status: z.enum(["pending", "confirmed", "preparing", "ready", "served", "completed", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid"]).default("pending"),
  paymentMode: z.enum(["cash", "upi", "card", "online"]).nullable().optional(),
  note: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().nullable().optional(),
  customerAddress: z.string().nullable().optional()
});

// server/routes.ts
function getAdminToken() {
  return process.env.ADMIN_API_TOKEN || (process.env.NODE_ENV !== "production" ? "admin123" : "");
}
function isAuthorizedAdmin(authHeader) {
  const token = getAdminToken();
  return Boolean(token && authHeader === `Bearer ${token}`);
}
async function registerRoutes(app2) {
  app2.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const result = await storage.createOrUpdateCustomer(validatedData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });
  app2.get("/api/customers", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!isAuthorizedAdmin(authHeader)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
      const dateFrom = req.query.dateFrom;
      const dateTo = req.query.dateTo;
      const allCustomers = await storage.getCustomers();
      let filtered = allCustomers.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contactNumber.includes(search);
        let matchesDate = true;
        if (dateFrom || dateTo) {
          const visitDate = new Date(c.createdAt);
          const vYear = visitDate.getFullYear();
          const vMonth = String(visitDate.getMonth() + 1).padStart(2, "0");
          const vDay = String(visitDate.getDate()).padStart(2, "0");
          const visitDateString = `${vYear}-${vMonth}-${vDay}`;
          if (dateFrom) {
            if (visitDateString < dateFrom) matchesDate = false;
          }
          if (dateTo) {
            if (visitDateString > dateTo) matchesDate = false;
          }
        }
        return matchesSearch && matchesDate;
      });
      filtered.sort((a, b) => {
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
  app2.get("/api/customers/by-phone/:phone", async (req, res) => {
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
  app2.post("/api/customers/:phone/favorites/toggle", async (req, res) => {
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
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const categoryQuery = req.query.category || req.params.category;
      console.log(`[API] Fetching menu items for category: ${categoryQuery}`);
      if (categoryQuery) {
        const items2 = await storage.getMenuItemsByCategory(categoryQuery);
        return res.json(items2);
      }
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });
  app2.patch("/api/menu-items/:id", async (req, res) => {
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
  app2.get("/api/cart", async (req, res) => {
    try {
      const items = await storage.getCartItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });
  app2.delete("/api/cart", async (req, res) => {
    try {
      await storage.clearCart();
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.get("/api/welcome-screen-ui", async (req, res) => {
    try {
      const ui = await storage.getWelcomeScreenUI();
      if (!ui) return res.status(404).json({ message: "Welcome screen UI not found" });
      res.json(ui);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch welcome screen UI" });
    }
  });
  app2.get("/api/carousel", async (req, res) => {
    try {
      const images = await storage.getCarouselImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });
  app2.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });
  app2.get("/api/logo", async (req, res) => {
    try {
      const logo = await storage.getLogo();
      if (!logo) return res.status(404).json({ message: "Logo not found" });
      res.json(logo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logo" });
    }
  });
  app2.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      if (!links) return res.status(404).json({ message: "Social links not found" });
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });
  app2.patch("/api/social-links", async (req, res) => {
    try {
      const updated = await storage.updateSocialLinks(req.body);
      if (!updated) return res.status(404).json({ message: "Social links not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update social links" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/menu-categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });
  app2.get("/api/smart-picks-categories", async (req, res) => {
    try {
      const categories = await storage.getSmartPicksCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch smart picks categories" });
    }
  });
  app2.patch("/api/smart-picks-categories/:key/visibility", async (req, res) => {
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
  app2.post("/api/reservations", async (req, res) => {
    try {
      const validated = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validated);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Invalid reservation data" });
    }
  });
  app2.get("/api/reservations", async (req, res) => {
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
  app2.get("/api/call-waiter", async (req, res) => {
    try {
      const status = await storage.getCallWaiterStatus();
      res.json(status ?? { called: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call waiter status" });
    }
  });
  app2.patch("/api/call-waiter", async (req, res) => {
    try {
      const { called } = req.body;
      if (typeof called !== "boolean") return res.status(400).json({ message: "'called' must be a boolean" });
      const status = await storage.setCallWaiterStatus(called);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to update call waiter status" });
    }
  });
  app2.get("/api/payment-details", async (req, res) => {
    try {
      const details = await storage.getPaymentDetails();
      if (!details) return res.status(404).json({ message: "Payment details not found" });
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment details" });
    }
  });
  app2.get("/api/restaurant-info", async (req, res) => {
    try {
      const info = await storage.getRestaurantInfo();
      if (!info) return res.status(404).json({ message: "Restaurant info not found" });
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant info" });
    }
  });
  app2.patch("/api/restaurant-info", async (req, res) => {
    try {
      const updated = await storage.updateRestaurantInfo(req.body);
      if (!updated) return res.status(404).json({ message: "Restaurant info not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update restaurant info" });
    }
  });
  app2.get("/api/offer-tile-images", async (req, res) => {
    try {
      const images = await storage.getOfferTileImages();
      if (!images) return res.status(404).json({ message: "Offer tile images not found" });
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offer tile images" });
    }
  });
  app2.patch("/api/offer-tile-images", async (req, res) => {
    try {
      const updated = await storage.updateOfferTileImages(req.body);
      if (!updated) return res.status(404).json({ message: "Offer tile images not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer tile images" });
    }
  });
  app2.post("/api/fix-veg-classification", async (req, res) => {
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
  app2.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/by-phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      res.set("Cache-Control", "no-store");
      const customerOrders = await storage.getOrdersByPhone(phone);
      res.json(customerOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });
  app2.get("/api/pos-settings", async (req, res) => {
    try {
      const settings = await storage.getPosSettings();
      res.setHeader("Cache-Control", "no-store");
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch POS settings" });
    }
  });
  app2.delete("/api/orders/by-phone/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const deletedCount = await storage.deleteCompletedOrdersByPhone(phone);
      res.json({ deletedCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order history" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  assetsInclude: ["**/*.JPG"],
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await storage.connect();
  log("Connected to MongoDB");
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
