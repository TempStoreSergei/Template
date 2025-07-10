export interface Unit {
  id: string;
  unitFullname: string;
  unitShortname: string;
  unitType: "weight" | "volume" | "count" | "length";
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUnitRequest {
  unitFullname: string;
  unitShortname: string;
  unitType: "weight" | "volume" | "count" | "length";
}

export interface UpdateUnitRequest {
  id: string;
  unitFullname?: string;
  unitShortname?: string;
  unitType?: "weight" | "volume" | "count" | "length";
  isActive?: boolean;
} 