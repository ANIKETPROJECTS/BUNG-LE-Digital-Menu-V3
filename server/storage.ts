import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { type User, type InsertUser, type MenuItem, type InsertMenuItem, type CartItem, type InsertCartItem, type Customer, type InsertCustomer, type FavoriteItem, type InsertFavoriteItem, type SocialLinks, type WelcomeScreenUI, type Coupon, type CarouselImage, type Logo, type MenuCategory, type MenuSubCategory, type Reservation, type InsertReservation, type PaymentDetails, type CallWaiter, type RestaurantInfo, type SmartPicksCategory, type OfferTileImages, type Order, type InsertOrder } from "@shared/schema";

type UpdateMenuItemFlags = {
  todaysSpecial?: boolean;
  chefSpecial?: boolean;
  isAvailable?: boolean;
};

function normalizeCategory(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryIdFor(title: string, fallback?: string): string {
  return (fallback && fallback.trim()) || normalizeCategory(title);
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getCategories(): string[];
  addMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItemFlags(id: string, category: string, flags: UpdateMenuItemFlags): Promise<MenuItem | undefined>;

  getCartItems(): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(): Promise<void>;
  
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createOrUpdateCustomer(customer: InsertCustomer): Promise<{ customer: Customer; isNew: boolean }>;
  toggleFavorite(phone: string, item: InsertFavoriteItem): Promise<Customer | undefined>;

  getSocialLinks(): Promise<SocialLinks | null>;
  updateSocialLinks(data: Partial<Omit<SocialLinks, '_id'>>): Promise<SocialLinks | null>;
  getWelcomeScreenUI(): Promise<WelcomeScreenUI | null>;
  getCoupons(): Promise<Coupon[]>;
  getCarouselImages(): Promise<CarouselImage[]>;
  getLogo(): Promise<Logo | null>;
  getMenuCategories(): Promise<MenuCategory[]>;

  clearDatabase(): Promise<void>;
  fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }>;

  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservations(): Promise<Reservation[]>;
  getPaymentDetails(): Promise<PaymentDetails | null>;

  getCallWaiterStatus(): Promise<CallWaiter | null>;
  setCallWaiterStatus(called: boolean): Promise<CallWaiter>;

  getRestaurantInfo(): Promise<RestaurantInfo | null>;
  updateRestaurantInfo(data: Partial<Omit<RestaurantInfo, '_id'>>): Promise<RestaurantInfo | null>;

  getSmartPicksCategories(): Promise<SmartPicksCategory[]>;
  updateSmartPicksCategoryVisibility(key: string, isVisible: boolean): Promise<SmartPicksCategory | null>;

  getOfferTileImages(): Promise<OfferTileImages | null>;
  updateOfferTileImages(data: Partial<Omit<OfferTileImages, '_id'>>): Promise<OfferTileImages | null>;

  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrdersByPhone(phone: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | null>;
  deleteCompletedOrdersByPhone(phone: string): Promise<number>;

  getPosSettings(): Promise<{ taxRate: number; serviceCharge: number; gstEnabled: boolean; gstNumber: string }>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private customersDb: Db;
  private socialsDb: Db;
  private welcomeScreenDb: Db;
  private menuPageDb: Db;
  private hamburgerDb: Db;
  private cartItemsCollection: Collection<CartItem>;
  private usersCollection: Collection<User>;
  private customersCollection: Collection<Customer>;
  private linksCollection: Collection<SocialLinks>;
  private welcomeScreenUiCollection: Collection<WelcomeScreenUI>;
  private couponsCollection: Collection<Coupon>;
  private carouselCollection: Collection<CarouselImage>;
  private logoCollection: Collection<Logo>;
  private categoriesCollection: Collection<MenuCategory>;
  private reservationCollection: Collection<Reservation>;
  private paymentDetailsCollection: Collection<PaymentDetails>;
  private callWaiterCollection: Collection<CallWaiter>;
  private restaurantInfoCollection: Collection<RestaurantInfo>;
  private smartpicksDb: Db;
  private smartpicksCategorieCollection: Collection<SmartPicksCategory>;
  private offerTileImagesCollection: Collection<OfferTileImages>;
  private ordersDb: Db;
  private ordersCollection: Collection<Order>;
  private posDb: Db;
  private posSettingsCollection: Collection<{ key: string; value: string }>;
  private restaurantId: ObjectId;

  private readonly categories = [
    // FOOD
    "soups", "khane-peene", "continental-veg", "continental-non-veg",
    "pasta", "pizza", "tandoor-veg", "tandoor-non-veg",
    "oriental-starter-veg", "oriental-starter-non-veg", "jalpari-special",
    "sabzi-tarkari", "murg-e-khaas", "gosht-e-khaas", "agri-style",
    "rotis", "oriental-curries", "fried-rice-noodles", "basmati-ki-khushbu",
    "dals", "salad-raita", "desserts",
    // USER-CREATED MENU CATEGORIES
    "nonveg-rice", "soup-veg-starters",
    "nonveg-starters-appetizers", "nonveg-noodle-veg-rice",
    // BAR
    "cocktails", "shots", "beer", "alcopops", "wine", "liquor", "beverages",
    "whisky", "single-malt", "bourbon-irish", "vodka", "gin", "rum", "brandy",
    // MOCKTAILS
    "mocktails-drinks",
    // OFFER ITEMS
    "offer-cocktails", "offer-mocktails"
  ];

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db("bungle");
    this.customersDb = this.client.db("customersdb");
    this.socialsDb = this.client.db("socialsandcontact");
    this.welcomeScreenDb = this.client.db("welcomescreen");
    this.menuPageDb = this.client.db("menupage");
    this.hamburgerDb = this.client.db("hamburger");
    this.cartItemsCollection = this.db.collection("cartitems");
    this.usersCollection = this.db.collection("users");
    this.customersCollection = this.customersDb.collection("customers");
    this.linksCollection = this.socialsDb.collection<SocialLinks>("link");
    this.welcomeScreenUiCollection = this.welcomeScreenDb.collection<WelcomeScreenUI>("welcomescreenui");
    this.couponsCollection = this.menuPageDb.collection<Coupon>("coupons");
    this.carouselCollection = this.menuPageDb.collection<CarouselImage>("carousel");
    this.logoCollection = this.menuPageDb.collection<Logo>("logo");
    this.categoriesCollection = this.menuPageDb.collection<MenuCategory>("categories");
    this.reservationCollection = this.hamburgerDb.collection<Reservation>("reservation");
    this.paymentDetailsCollection = this.hamburgerDb.collection<PaymentDetails>("paymentdetails");
    this.callWaiterCollection = this.menuPageDb.collection<CallWaiter>("callwaiter");
    this.restaurantInfoCollection = this.hamburgerDb.collection<RestaurantInfo>("restaurantinfo");
    this.smartpicksDb = this.client.db("smartpicks");
    this.smartpicksCategorieCollection = this.smartpicksDb.collection<SmartPicksCategory>("smartpickscategorie");
    this.offerTileImagesCollection = this.menuPageDb.collection<OfferTileImages>("offertileimages");
    this.ordersDb = this.client.db("Orders");
    this.ordersCollection = this.ordersDb.collection<Order>("orders");
    this.posDb = this.client.db("POS");
    this.posSettingsCollection = this.posDb.collection("settings");
    this.restaurantId = new ObjectId("6874cff2a880250859286de6");
  }

  async connect() {
    await this.client.connect();

    const menuPageCollections = await this.menuPageDb.listCollections().toArray();
    const menuPageExistingNames = menuPageCollections.map(c => c.name);

    // Migrate existing carousel documents to add visible: true if they don't have the field
    if (menuPageExistingNames.includes("carousel")) {
      const carouselMigrated = await this.carouselCollection.updateMany(
        { visible: { $exists: false } },
        { $set: { visible: true } }
      );
      if (carouselMigrated.modifiedCount > 0) {
        console.log(`[Storage] Migrated ${carouselMigrated.modifiedCount} carousel documents to add visible: true`);
      }
    }

    // Migrate all categories and their subcategories to add visible: true where missing
    if (menuPageExistingNames.includes("categories")) {
      const allCats = await this.categoriesCollection.find({}).toArray();
      let migrated = 0;
      for (const cat of allCats) {
        const updates: any = {};
        if (cat.visible === undefined || cat.visible === null) {
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

    const smartpicksCollections = await this.smartpicksDb.listCollections().toArray();
    const smartpicksExistingNames = smartpicksCollections.map(c => c.name);

    // Migrate existing smart picks documents: add isVisible: true if field is missing
    if (smartpicksExistingNames.includes("smartpickscategorie")) {
      await this.smartpicksCategorieCollection.updateMany(
        { isVisible: { $exists: false } },
        { $set: { isVisible: true } }
      );
    }

    // Sync smart picks flags on startup and watch for live changes
    await this.syncSmartPicksFlags();
    if (smartpicksExistingNames.includes("smartpickscategorie")) {
      this.watchSmartPicksCategories();
    }
  }

  async getOfferTileImages(): Promise<OfferTileImages | null> {
    return await this.offerTileImagesCollection.findOne({});
  }

  async updateOfferTileImages(data: Partial<Omit<OfferTileImages, '_id'>>): Promise<OfferTileImages | null> {
    const existing = await this.offerTileImagesCollection.findOne({});
    if (!existing) return null;
    const updated = await this.offerTileImagesCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: 'after' }
    );
    return updated;
  }

  async getSocialLinks(): Promise<SocialLinks | null> {
    return await this.linksCollection.findOne({});
  }

  async updateSocialLinks(data: Partial<Omit<SocialLinks, '_id'>>): Promise<SocialLinks | null> {
    const existing = await this.linksCollection.findOne({});
    if (!existing) return null;
    const updated = await this.linksCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: 'after' }
    );
    return updated;
  }

  async getWelcomeScreenUI(): Promise<WelcomeScreenUI | null> {
    return await this.welcomeScreenUiCollection.findOne({});
  }

  async getCoupons(): Promise<Coupon[]> {
    return await this.couponsCollection.find({ show: true }).toArray();
  }

  async getCarouselImages(): Promise<CarouselImage[]> {
    return await this.carouselCollection.find({ visible: true }).sort({ order: 1 }).toArray();
  }

  async getLogo(): Promise<Logo | null> {
    return await this.logoCollection.findOne({});
  }

  async getSmartPicksCategories(): Promise<SmartPicksCategory[]> {
    return await this.smartpicksCategorieCollection.find({ isVisible: true }).sort({ order: 1 }).toArray();
  }

  async updateSmartPicksCategoryVisibility(key: string, isVisible: boolean): Promise<SmartPicksCategory | null> {
    await this.smartpicksCategorieCollection.updateOne({ key }, { $set: { isVisible } });
    return await this.smartpicksCategorieCollection.findOne({ key }) as SmartPicksCategory | null;
  }

  async syncSmartPicksFlags(): Promise<void> {
    const cats = await this.smartpicksCategorieCollection.find({}).toArray();
    const currentKeys = cats.map(c => c.key);

    const metaCollection = this.smartpicksDb.collection<any>("metadata");
    const meta = await metaCollection.findOne({ _id: "managedKeys" as any });
    const previousKeys: string[] = meta?.keys ?? [];

    const keysToAdd = currentKeys.filter(k => !previousKeys.includes(k));
    const keysToRemove = previousKeys.filter(k => !currentKeys.includes(k));

    if (keysToAdd.length === 0 && keysToRemove.length === 0) return;

    // Only update collections that already exist. MongoDB's updateMany()
    // creates a collection when its target does not exist, which previously
    // recreated the empty legacy category collections on startup.
    const existingCollections = await this.db.listCollections().toArray();
    const allCollections = existingCollections.map(({ name }) => this.db.collection<MenuItem>(name));

    for (const col of allCollections) {
      for (const key of keysToAdd) {
        await col.updateMany({ [key]: { $exists: false } }, { $set: { [key]: false } });
      }
      if (keysToRemove.length > 0) {
        const unset: Record<string, string> = {};
        keysToRemove.forEach(k => { unset[k] = ""; });
        await col.updateMany({}, { $unset: unset });
      }
    }

    await metaCollection.updateOne(
      { _id: "managedKeys" as any },
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

  watchSmartPicksCategories(): void {
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

  private addVisibilityToSubcats(subcats: MenuSubCategory[]): { changed: boolean; result: MenuSubCategory[] } {
    let changed = false;
    const result = subcats.map(sub => {
      const updated: any = { ...sub };
      if (updated.visible === undefined || updated.visible === null) {
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

  private filterVisibleSubcats(subcats: MenuSubCategory[]): MenuSubCategory[] {
    return subcats
      .filter(sub => sub.visible !== false)
      .map(sub => ({
        ...sub,
        // Category documents imported from the admin app may only contain a
        // title. The customer menu needs an id to build its URL.
        id: categoryIdFor(sub.title, sub.id),
        subcategories: this.filterVisibleSubcats(sub.subcategories || []),
      }));
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    const all = await this.categoriesCollection.find({}).sort({ order: 1 }).toArray();
    return all
      .filter(cat => cat.visible !== false)
      .map(cat => ({
        ...cat,
        // Older category records do not have an id. The customer menu uses
        // this value for routing, so derive one from the stored title.
        id: categoryIdFor(cat.title, cat.id),
        subcategories: this.filterVisibleSubcats(cat.subcategories || []),
      }));
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user = { ...insertUser, createdAt: now, updatedAt: now };
    const result = await this.usersCollection.insertOne(user as any);
    return { _id: result.insertedId, ...user } as any;
  }

  async getCustomers(): Promise<Customer[]> {
    return await this.customersCollection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const customer = await this.customersCollection.findOne({ contactNumber: phone });
    return customer || undefined;
  }

  async createOrUpdateCustomer(insertCustomer: InsertCustomer): Promise<{ customer: Customer; isNew: boolean }> {
    const existing = await this.getCustomerByPhone(insertCustomer.contactNumber);
    const now = new Date();
    
    if (existing) {
      const lastVisit = existing.lastVisitDate ? new Date(existing.lastVisitDate) : null;
      const isSameDay = lastVisit && 
        lastVisit.getFullYear() === now.getFullYear() &&
        lastVisit.getMonth() === now.getMonth() &&
        lastVisit.getDate() === now.getDate();

      const updateData: any = { 
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
        { returnDocument: 'after' }
      );
      return { customer: updated!, isNew: false };
    }
    
    const customer = { 
      ...insertCustomer, 
      visitCount: 1,
      lastVisitDate: now,
      createdAt: now, 
      updatedAt: now 
    };
    const result = await this.customersCollection.insertOne(customer as any);
    return { customer: { _id: result.insertedId, ...customer } as any, isNew: true };
  }

  async toggleFavorite(phone: string, item: InsertFavoriteItem): Promise<Customer | undefined> {
    const existing = await this.getCustomerByPhone(phone);
    if (!existing) return undefined;

    // Atomic, filter-guarded toggle: try to remove the item first (only matches
    // if it is present), otherwise add it (only matches if it is NOT present).
    // Guarding both ops with the presence filter avoids duplicate favorites
    // from concurrent toggle requests, unlike a read-then-blindly-write approach.
    const pullResult = await this.customersCollection.updateOne(
      { _id: existing._id, "favorites.menuItemId": item.menuItemId },
      { $pull: { favorites: { menuItemId: item.menuItemId } }, $set: { updatedAt: new Date() } } as any
    );

    if (pullResult.modifiedCount === 0) {
      const favorite: FavoriteItem = { ...item, addedAt: new Date() };
      await this.customersCollection.updateOne(
        { _id: existing._id, "favorites.menuItemId": { $ne: item.menuItemId } },
        { $push: { favorites: favorite }, $set: { updatedAt: new Date() } } as any
      );
    }

    return await this.getCustomerByPhone(phone);
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const allMenuItems: MenuItem[] = [];
    // Menu items are stored in bungle collections created by the admin app.
    // Do not rely on the legacy hardcoded collection list: imported category
    // names (for example "SOUP") can be arbitrary.
    const collections = await this.db.listCollections().toArray();
    for (const collectionInfo of collections) {
      const items = await this.db
        .collection<MenuItem>(collectionInfo.name)
        .find({ category: { $exists: true } })
        .toArray();
      allMenuItems.push(...items);
    }
    return this.sortMenuItems(allMenuItems);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    console.log(`[Storage] Fetching items for category: ${category}`);
    try {
      // The admin app stores the category value on each item. Resolve a
      // customer-facing route id (e.g. "soup") to every equivalent value
      // found in menupage.categories (e.g. title "SOUP").
      const categoryAliases = await this.getCategoryAliases(category);
      const categoryPatterns = categoryAliases.map(value =>
        new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
      );
      const query = { category: { $in: categoryPatterns } };
      const allMatches: MenuItem[] = [];
      const dbCollections = await this.db.listCollections().toArray();

      for (const collectionInfo of dbCollections) {
        const matches = await this.db
          .collection<MenuItem>(collectionInfo.name)
          .find(query)
          .toArray();
        allMatches.push(...matches);
      }

      console.log(`[Storage] Found ${allMatches.length} items for category aliases: ${categoryAliases.join(", ")}`);
      return this.sortMenuItems(allMatches);
    } catch (error) {
      console.error(`[Storage] Error fetching items for ${category}:`, error);
      return [];
    }
  }

  private async getCategoryAliases(category: string): Promise<string[]> {
    const aliases = new Set<string>([category]);
    const categories = await this.categoriesCollection.find({}).toArray();

    const visit = (node: { id?: string; title?: string; subcategories?: MenuSubCategory[] }) => {
      const values = [node.id, node.title].filter((value): value is string => Boolean(value?.trim()));
      if (values.some(value => normalizeCategory(value) === normalizeCategory(category))) {
        values.forEach(value => aliases.add(value));
      }
      (node.subcategories || []).forEach(visit);
    };

    categories.forEach(visit);
    return Array.from(aliases);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const collections = await this.db.listCollections().toArray();
    for (const { name } of collections) {
      const menuItem = await this.db.collection<MenuItem>(name).findOne({ _id: new ObjectId(id) });
      if (menuItem) return menuItem;
    }
    return undefined;
  }

  getCategories(): string[] {
    return [];
  }

  async addMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const collection = this.db.collection(item.category);
    const now = new Date();
    const menuItem = { ...item, restaurantId: this.restaurantId, createdAt: now, updatedAt: now, __v: 0 };
    const result = await collection.insertOne(menuItem as any);
    return { _id: result.insertedId, ...menuItem } as any;
  }

  async updateMenuItemFlags(id: string, category: string, flags: UpdateMenuItemFlags): Promise<MenuItem | undefined> {
    const collection = this.db.collection<MenuItem>(category);
    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...flags, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return updated || undefined;
  }

  async getCartItems(): Promise<CartItem[]> {
    return await this.cartItemsCollection.find({}).toArray();
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const menuItemId = new ObjectId(item.menuItemId);
    const existing = await this.cartItemsCollection.findOne({ menuItemId });
    if (existing) {
      const updated = await this.cartItemsCollection.findOneAndUpdate(
        { _id: existing._id },
        { $inc: { quantity: item.quantity || 1 }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return updated!;
    }
    const now = new Date();
    const cartItem = { menuItemId, quantity: item.quantity || 1, createdAt: now, updatedAt: now };
    const result = await this.cartItemsCollection.insertOne(cartItem as any);
    return { _id: result.insertedId, ...cartItem } as any;
  }

  async removeFromCart(id: string): Promise<void> {
    await this.cartItemsCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async clearCart(): Promise<void> {
    await this.cartItemsCollection.deleteMany({});
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const now = new Date();
    const doc = { ...reservation, createdAt: now };
    const result = await this.reservationCollection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc } as any;
  }

  async getReservations(): Promise<Reservation[]> {
    return await this.reservationCollection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getPaymentDetails(): Promise<PaymentDetails | null> {
    return await this.paymentDetailsCollection.findOne({});
  }

  async getRestaurantInfo(): Promise<RestaurantInfo | null> {
    return await this.restaurantInfoCollection.findOne({});
  }

  async updateRestaurantInfo(data: Partial<Omit<RestaurantInfo, '_id'>>): Promise<RestaurantInfo | null> {
    const existing = await this.restaurantInfoCollection.findOne({});
    if (!existing) return null;
    const updated = await this.restaurantInfoCollection.findOneAndUpdate(
      { _id: existing._id },
      { $set: data },
      { returnDocument: 'after' }
    );
    return updated;
  }

  async getCallWaiterStatus(): Promise<CallWaiter | null> {
    return await this.callWaiterCollection.findOne({});
  }

  async setCallWaiterStatus(called: boolean): Promise<CallWaiter> {
    const existing = await this.callWaiterCollection.findOne({});
    if (existing) {
      const updated = await this.callWaiterCollection.findOneAndUpdate(
        { _id: existing._id },
        { $set: { called } },
        { returnDocument: "after" }
      );
      return updated!;
    }
    const result = await this.callWaiterCollection.insertOne({ called } as any);
    return { _id: result.insertedId, called } as any;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const now = new Date();

    // Derive POS-compatible tableNumber from tableId if not explicitly supplied
    // e.g. "Table1" → "T1", "Table 2" → "T2", already "T3" → "T3"
    const tableNumber = order.tableNumber
      ?? order.tableId.replace(/^table\s*/i, "T").replace(/^T(\d)$/i, "T$1");

    const doc = {
      ...order,
      tableNumber,
      floorId: order.floorId ?? "Ground Floor",
      orderType: order.orderType ?? "dine-in",
      paymentStatus: order.paymentStatus ?? "pending",
      paymentMode: order.paymentMode ?? null,
      customerEmail: order.customerEmail ?? null,
      customerAddress: order.customerAddress ?? null,
      items: order.items.map(item => ({
        ...item,
        isVeg: item.isVeg ?? true,
        notes: item.notes ?? null,
      })),
      createdAt: now,
    };

    const result = await this.ordersCollection.insertOne(doc as any);
    return { _id: result.insertedId, ...doc } as any;
  }

  async addItemsToOngoingOrder(order: InsertOrder): Promise<Order | null> {
    const filter: any = {
      tableId: order.tableId,
      floorId: order.floorId ?? "Ground Floor",
      status: { $nin: ["completed", "cancelled"] },
    };
    if (order.customerPhone) filter.customerPhone = order.customerPhone;

    const existing = await this.ordersCollection.findOne(filter, { sort: { createdAt: -1 } });
    if (!existing) return null;

    const items = [
      ...(existing.items ?? []),
      ...order.items.map(item => ({
        ...item,
        isVeg: item.isVeg ?? true,
        notes: item.notes ?? null,
      })),
    ];
    const updated = await this.ordersCollection.findOneAndUpdate(
      { _id: existing._id },
      {
        $set: {
          items,
          total: (existing.total ?? 0) + order.total,
          note: [existing.note, order.note].filter(Boolean).join(" | ") || undefined,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );
    return updated as Order | null;
  }

  async getOrders(): Promise<Order[]> {
    return await this.ordersCollection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getOrdersByPhone(phone: string): Promise<Order[]> {
    const orders = await this.ordersCollection
      .find({ customerPhone: phone })
      .sort({ createdAt: -1 })
      .toArray();

    // Auto-sync: for any pending order linked to a POS order, check if POS has completed it
    const posOrdersCollection = this.posDb.collection("orders");
    const pendingWithPosId = orders.filter(
      (o: any) => o.status === "pending" && o.posOrderId
    );

    if (pendingWithPosId.length > 0) {
      const posIds = pendingWithPosId.map((o: any) => o.posOrderId);
      const posCompleted = await posOrdersCollection
        .find({ id: { $in: posIds }, status: "completed" })
        .project({ id: 1 })
        .toArray();

      if (posCompleted.length > 0) {
        const completedPosIds = new Set(posCompleted.map((p: any) => p.id));
        // Bulk-update matching Bung-le orders to completed
        await this.ordersCollection.updateMany(
          { customerPhone: phone, status: "pending", posOrderId: { $in: Array.from(completedPosIds) } },
          { $set: { status: "completed" } }
        );
        // Reflect the update in the returned array
        for (const order of orders as any[]) {
          if (order.status === "pending" && completedPosIds.has(order.posOrderId)) {
            order.status = "completed";
          }
        }
      }
    }

    return orders;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const { ObjectId } = await import("mongodb");
    let oid: InstanceType<typeof ObjectId>;
    try { oid = new ObjectId(id); } catch { return null; }
    const updated = await this.ordersCollection.findOneAndUpdate(
      { _id: oid },
      { $set: { status } },
      { returnDocument: "after" }
    );
    return updated as any ?? null;
  }

  async deleteCompletedOrdersByPhone(phone: string): Promise<number> {
    const result = await this.ordersCollection.deleteMany({
      customerPhone: phone,
      status: { $in: ["completed", "cancelled"] },
    });
    return result.deletedCount ?? 0;
  }

  async clearDatabase(): Promise<void> {
    const collections = await this.db.listCollections().toArray();
    for (const { name } of collections) {
      await this.db.collection<MenuItem>(name).deleteMany({});
    }
  }

  async fixVegNonVegClassification(): Promise<{ updated: number; details: string[] }> {
    return { updated: 0, details: [] };
  }

  async getPosSettings(): Promise<{ taxRate: number; serviceCharge: number; gstEnabled: boolean; gstNumber: string }> {
    const docs = await this.posSettingsCollection.find({}).toArray();
    const map: Record<string, string> = {};
    for (const doc of docs) map[doc.key] = doc.value;
    return {
      taxRate: parseFloat(map["tax_rate"] ?? "0"),
      serviceCharge: parseFloat(map["service_charge"] ?? "0"),
      gstEnabled: (map["gst_enabled"] ?? "false") === "true",
      gstNumber: map["gst_number"] ?? "",
    };
  }

  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items.sort((a, b) => {
      if (a.isVeg !== b.isVeg) return a.isVeg ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
}

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error("MONGODB_URI environment variable is required");
}

export const storage = new MongoStorage(connectionString);
