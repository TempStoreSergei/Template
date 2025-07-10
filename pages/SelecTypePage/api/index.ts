import type { 
  Template, 
  Category, 
  Item, 
  CreateTemplateRequest, 
  CreateCategoryRequest, 
  CreateItemRequest, 
  ApiResponse 
} from "../model/types";

const API_BASE_URL = "http://192.168.0.100:8002";

// Template management
export const getAllTemplates = async (): Promise<Template[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/get_templates`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Template[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    // Return demo data for now
    return createLocalDemoData();
  }
};

export const createTemplate = async (
  request: CreateTemplateRequest,
): Promise<Template> => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating template:", error);
    // Create locally for now
    return createLocalTemplate(request);
  }
};

export const updateTemplate = async (
  id: string,
  template: Template,
): Promise<Template> => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating template:", error);
    return template;
  }
};

export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting template:", error);
  }
};

// Сохранение шаблона в zip
export const saveTemplateAsZip = async (templateId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates/save_zip_template/${encodeURIComponent(templateId)}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Ожидаем ссылку на файл в ответе
    const data = await response.json();
    // Например: { url: "http://192.168.0.100:8020/static/templates/Шаблон_3_xxx.zip" }
    return data;
  } catch (error) {
    console.error("Error saving template as zip:", error);
    throw error;
  }
};

// Category management
export const createCategory = async (
  templateId: string,
  request: CreateCategoryRequest,
): Promise<Category> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/templates/${templateId}/categories/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    return createLocalCategory(request);
  }
};

// Item management
export const createItem = async (
  categoryId: string,
  request: CreateItemRequest,
): Promise<Item> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/items/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating item:", error);
    return createLocalItem(request);
  }
};

// Search functionality
export const searchTemplates = async (query: string): Promise<Template[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/templates/search?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching templates:", error);
    return [];
  }
};

// Local/demo functions for offline development
const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createLocalDemoData = (): Template[] => {
  return [
    {
      id: "5dcb0e64-b3d3-4881-a411-7063cd242f20",
      name: "Шаблон пекарни",
      categories: [
        {
          id: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
          parentId: null,
          categoryName: "Хлебобулочные изделия",
          categoryShortName: "Хлеб",
          categoryExpirationDate: Date.now() + 86400000 * 30,
          items: [
            {
              id: "item-1",
              categoryId: "e4fb4522-d07d-4fda-96db-0a46e708d07d",
              itemName: "Хлеб белый",
              itemShortName: "Хлеб",
              itemInStock: true,
              itemExpirationDate: Date.now() + 86400000 * 3,
              itemUnit: "шт",
              itemImage: "",
              itemRecipe:
                "Классический рецепт белого хлеба. Смешать муку, воду, дрожжи.",
              ingredients: [
                {
                  id: "ing-1",
                  unitId: "27bd4b11-0b9b-4d15-91a5-87d060f88255",
                  ingredientName: "Мука пшеничная",
                  ingredientWeight: 500,
                },
              ],
            },
          ],
          children: [],
        },
      ],
      users: [
        {
          id: "7a2c914e-fce3-4cd4-9977-4b5e2d6eab41",
          userSurname: "Иванов",
          user_fullname: "Иван",
          userPatronymic: "Иванович",
        },
      ],
      units: [
        {
          id: "27bd4b11-0b9b-4d15-91a5-87d060f88255",
          unitFullname: "Грамм",
          unitShortname: "г",
        },
      ],
    },
  ];
};

const createLocalTemplate = (request: CreateTemplateRequest): Template => {
  return {
    id: generateId(),
    name: request.name,
    categories: [],
    users: [],
    units: [],
  };
};

const createLocalCategory = (request: CreateCategoryRequest): Category => {
  return {
    id: generateId(),
    parentId: null,
    categoryName: request.categoryName,
    categoryShortName: request.categoryShortName,
    categoryExpirationDate: request.categoryExpirationDate,
    items: [],
    children: [],
  };
};

const createLocalItem = (request: CreateItemRequest): Item => {
  return {
    id: generateId(),
    categoryId: request.categoryId,
    itemName: request.itemName,
    itemShortName: request.itemShortName,
    itemInStock: request.itemInStock,
    itemExpirationDate: request.itemExpirationDate,
    itemImage: request.itemImage,
    itemRecipe: request.itemRecipe,
    ingredients: [],
  };
};
