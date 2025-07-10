import type { Unit, CreateUnitRequest, UpdateUnitRequest } from "../model/types";

const generateId = () => `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const unitsApi = {
  async getAll(): Promise<Unit[]> {
    try {
      const stored = localStorage.getItem('units');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading units:', error);
      return [];
    }
  },

  async create(request: CreateUnitRequest): Promise<Unit> {
    const unit: Unit = {
      id: generateId(),
      ...request,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const units = await this.getAll();
      units.push(unit);
      localStorage.setItem('units', JSON.stringify(units));
      return unit;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw error;
    }
  },

  async update(request: UpdateUnitRequest): Promise<Unit> {
    try {
      const units = await this.getAll();
      const index = units.findIndex(u => u.id === request.id);
      
      if (index === -1) {
        throw new Error('Unit not found');
      }

      units[index] = {
        ...units[index],
        ...request,
        updatedAt: Date.now(),
      };

      localStorage.setItem('units', JSON.stringify(units));
      return units[index];
    } catch (error) {
      console.error('Error updating unit:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const units = await this.getAll();
      const filtered = units.filter(u => u.id !== id);
      localStorage.setItem('units', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw error;
    }
  },

  async toggleActive(id: string): Promise<Unit> {
    try {
      const units = await this.getAll();
      const unit = units.find(u => u.id === id);
      
      if (!unit) {
        throw new Error('Unit not found');
      }

      return await this.update({
        id,
        isActive: !unit.isActive,
      });
    } catch (error) {
      console.error('Error toggling unit status:', error);
      throw error;
    }
  },

  async createDemoUnits(): Promise<void> {
    const demoUnits: CreateUnitRequest[] = [
      {
        unitFullname: "Килограмм",
        unitShortname: "кг",
        unitType: "weight",
      },
      {
        unitFullname: "Грамм",
        unitShortname: "г",
        unitType: "weight",
      },
      {
        unitFullname: "Литр",
        unitShortname: "л",
        unitType: "volume",
      },
      {
        unitFullname: "Миллилитр",
        unitShortname: "мл",
        unitType: "volume",
      },
      {
        unitFullname: "Штука",
        unitShortname: "шт",
        unitType: "count",
      },
      {
        unitFullname: "Упаковка",
        unitShortname: "уп",
        unitType: "count",
      },
      {
        unitFullname: "Метр",
        unitShortname: "м",
        unitType: "length",
      },
      {
        unitFullname: "Сантиметр",
        unitShortname: "см",
        unitType: "length",
      }
    ];

    for (const unitRequest of demoUnits) {
      await this.create(unitRequest);
    }
  }
}; 