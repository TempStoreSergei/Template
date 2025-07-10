import type { Template, Category, Item, Ingredient, User, Unit } from "../model/types";

const DB_NAME = "TemplatesDB";
const DB_VERSION = 2;
const TEMPLATES_STORE = "templates";
const CATEGORIES_STORE = "categories";
const ITEMS_STORE = "items";
const INGREDIENTS_STORE = "ingredients";
const USERS_STORE = "users";
const UNITS_STORE = "units";

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

class TemplateDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Clear old stores if they exist
        if (db.objectStoreNames.contains("folders")) {
          db.deleteObjectStore("folders");
        }
        if (db.objectStoreNames.contains("files")) {
          db.deleteObjectStore("files");
        }

        // Create templates store
        if (!db.objectStoreNames.contains(TEMPLATES_STORE)) {
          db.createObjectStore(TEMPLATES_STORE, { keyPath: "id" });
        }

        // Create categories store
        if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
          const categoriesStore = db.createObjectStore(CATEGORIES_STORE, { keyPath: "id" });
          categoriesStore.createIndex("patentId", "patentId", { unique: false });
        }

        // Create items store
        if (!db.objectStoreNames.contains(ITEMS_STORE)) {
          const itemsStore = db.createObjectStore(ITEMS_STORE, { keyPath: "id" });
          itemsStore.createIndex("categoryId", "categoryId", { unique: false });
        }

        // Create ingredients store
        if (!db.objectStoreNames.contains(INGREDIENTS_STORE)) {
          const ingredientsStore = db.createObjectStore(INGREDIENTS_STORE, { keyPath: "id" });
          ingredientsStore.createIndex("unitId", "unitId", { unique: false });
        }

        // Create users store
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          db.createObjectStore(USERS_STORE, { keyPath: "id" });
        }

        // Create units store
        if (!db.objectStoreNames.contains(UNITS_STORE)) {
          db.createObjectStore(UNITS_STORE, { keyPath: "id" });
        }
      };
    });
  }

  async getAllTemplates(): Promise<Template[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TEMPLATES_STORE], "readonly");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async saveTemplate(template: Template): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TEMPLATES_STORE], "readwrite");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.put(template);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getTemplate(id: string): Promise<Template | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TEMPLATES_STORE], "readonly");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TEMPLATES_STORE], "readwrite");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async searchTemplates(query: string): Promise<Template[]> {
    const templates = await this.getAllTemplates();
    const lowerQuery = query.toLowerCase();

    return templates.filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.categories.some(cat => 
        cat.categoryName.toLowerCase().includes(lowerQuery) ||
        cat.items.some(item => 
          item.itemName.toLowerCase().includes(lowerQuery) ||
          item.itemRecipe.toLowerCase().includes(lowerQuery)
        )
      )
    );
  }

  async createDemoData(): Promise<void> {
    const units: Unit[] = [
      {
        id: "27bd4b11-0b9b-4d15-91a5-87d060f88255",
        unitFullname: "Грамм",
        unitShortname: "г"
      },
      {
        id: "unit-2",
        unitFullname: "Килограмм", 
        unitShortname: "кг"
      },
      {
        id: "unit-3",
        unitFullname: "Литр",
        unitShortname: "л"
      }
    ];

    const users: User[] = [
      {
        id: "7a2c914e-fce3-4cd4-9977-4b5e2d6eab41",
        userSurname: "Иванов",
        user_fullname: "Иван",
        userPatronymic: "Иванович"
      }
    ];

    const ingredients: Ingredient[] = [
      {
        id: "ing-1",
        unitId: "27bd4b11-0b9b-4d15-91a5-87d060f88255",
        ingredientName: "Мука пшеничная",
        ingredientWeight: 500
      },
      {
        id: "ing-2", 
        unitId: "27bd4b11-0b9b-4d15-91a5-87d060f88255",
        ingredientName: "Сахар",
        ingredientWeight: 200
      }
    ];

    const items: Item[] = [
      {
        id: "item-1",
        categoryId: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
        itemName: "Хлеб белый",
        itemShortName: "Хлеб",
        itemInStock: true,
        itemExpirationDate: Date.now() + 86400000 * 3,
        itemImage: "bread.jpg",
        itemRecipe: "Классический рецепт белого хлеба. Смешать муку, воду, дрожжи.",
        ingredients: ingredients
      }
    ];

    const categories: Category[] = [
      {
        id: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
        patentId: "ef7f56c6-0912-45f0-ab55-a72d40ed66e4",
        categoryName: "Хлебобулочные изделия",
        categoryShortName: "Хлеб",
        categoryExpirationDate: Date.now() + 86400000 * 30,
        items: items,
        subcategories: [
          {
            id: "subcat-1",
            patentId: generateId(),
            parentCategoryId: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
            categoryName: "Белый хлеб",
            categoryShortName: "Белый",
            categoryExpirationDate: Date.now() + 86400000 * 30,
            items: [],
            subcategories: []
          },
          {
            id: "subcat-2", 
            patentId: generateId(),
            parentCategoryId: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
            categoryName: "Черный хлеб",
            categoryShortName: "Черный",
            categoryExpirationDate: Date.now() + 86400000 * 30,
            items: [],
            subcategories: []
          }
        ]
      },
      {
        id: "cat-2",
        patentId: generateId(),
        categoryName: "Кондитерские изделия",
        categoryShortName: "Сладости",
        categoryExpirationDate: Date.now() + 86400000 * 60,
        items: [],
        subcategories: [
          {
            id: "subcat-3",
            patentId: generateId(),
            parentCategoryId: "cat-2",
            categoryName: "Торты",
            categoryShortName: "Торты",
            categoryExpirationDate: Date.now() + 86400000 * 30,
            items: [],
            subcategories: []
          }
        ]
      }
    ];

    const template: Template = {
      id: "5dcb0e64-b3d3-4881-a411-7063cd242f20",
      name: "Шаблон пекарни",
      categories: categories,
      users: users,
      units: units
    };

    await this.saveTemplate(template);
  }
}

export const templateDB = new TemplateDatabase(); 