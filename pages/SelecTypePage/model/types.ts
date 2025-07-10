export interface Category {
  id: string;
  categoryName: string;
  categoryExpirationDate: number | null;
  categoryParentID: string | null;
  children: Category[];
  items?: Dish[];
}

export interface Ingredient {
  id: string;
  ingridientName: string;
  ingridientWeight: number;
  unitShortname: string;
}

export interface Dish {
  id: string;
  itemName: string;
  categoryID: string;
  itemInStock: boolean;
  itemExpirationDate: number | null;
  itemImage?: string | null;
  itemRecipe?: string | null;
  itemPrice?: number | null;
  ingridients?: Ingredient[];
}

export interface ApiResponse {
  detail: string;
  categoriesData: Category[];
}

export interface SearchResponse {
  detail: string;
  categoriesData: Array<{
    id: string;
    categoryName: string;
  }>;
  itemsData: Array<{
    id: string;
    itemName: string;
  }>;
}