export interface Template {
  id: string;
  name: string;
  categories: Category[];
  users: User[];
  units: Unit[];
}

export interface Category {
  id: string;
  patentId: string;
  parentCategoryId?: string;
  categoryName: string;
  categoryShortName: string;
  categoryExpirationDate: number | null;
  unit: string;
  items: Item[];
  children: Category[];
}

export interface Item {
  id: string;
  categoryId: string;
  itemName: string;
  itemShortName: string;
  itemInStock: boolean;
  itemExpirationDate: number;
  itemImage: string;
  itemRecipe: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  unit: string;
  ingredientName: string;
  ingredientWeight: number;
}

export interface User {
  id: string;
  userSurname: string;
  user_fullname: string;
  userPatronymic: string;
}

export interface Unit {
  id: string;
  unitFullname: string;
  unitShortname: string;
}

export interface DriveItem {
  id: string;
  name: string;
  type: 'template' | 'category' | 'item';
  parentId?: string;
  createdAt: number;
  updatedAt: number;
  data?: any;
}

export interface CreateTemplateRequest {
  name: string;
}

export interface CreateCategoryRequest {
  templateId: string;
  categoryName: string;
  categoryShortName: string;
  categoryExpirationDate: number;
  categoryUnit: string;
}

export interface CreateItemRequest {
  categoryId: string;
  itemName: string;
  itemShortName: string;
  itemInStock: boolean;
  itemExpirationDate: number;
  itemImage: string;
  itemRecipe: string;
}

export interface ApiResponse {
  detail: string;
  data: Template[];
}