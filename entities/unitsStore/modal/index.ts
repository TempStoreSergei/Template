import { ref } from "vue";
import { defineStore } from "pinia";
import { message } from "ant-design-vue";
import { store } from "~/app/providers/store";

export type Unit = {
  id: number; // Auto-generated unique ID
  unitFullName: string; // Full name of the unit
  unitShortName: string; // Short name of the unit
};

export const useUnitStore = defineStore(
  "units",
  () => {
    const units = ref<Unit[]>([]); // Array of units
    const idCounter = ref(1); // Counter for generating unique IDs

    /**
     * Check if a unit already exists.
     * @param unit - Unit object to check.
     * @throws Error if a unit with the same full or short name exists.
     */
    const checkUnitExists = (unit: Omit<Unit, "id">) => {
      const exists = units.value.some(
        (existingUnit) =>
          existingUnit.unitFullName === unit.unitFullName ||
          existingUnit.unitShortName === unit.unitShortName,
      );
      if (exists) {
        message.error("Такая еденицая измерений уже существует");
        throw new Error(
          "A unit with the same full or short name already exists.",
        );
      }
    };

    /**
     * Add a new unit to the store.
     * @param unit - Unit object without an ID.
     */
    const createUnit = (unit: Omit<Unit, "id">) => {
      checkUnitExists(unit);
      const newUnit = { id: idCounter.value++, ...unit };
      units.value.push(newUnit);
      return newUnit;
    };

    /**
     * Update an existing unit by its ID.
     * @param id - ID of the unit to update.
     * @param updatedData - Updated properties for the unit.
     */
    const updateUnit = (id: number, updatedData: Partial<Unit>) => {
      const unitIndex = units.value.findIndex((unit) => unit.id === id);
      if (unitIndex !== -1) {
        units.value[unitIndex] = {
          ...units.value[unitIndex],
          ...updatedData,
        };
      }
    };

    /**
     * Delete a unit by its ID.
     * @param id - ID of the unit to delete.
     */
    const deleteUnit = (id: number) => {
      units.value = units.value.filter((unit) => unit.id !== id);
    };

    /**
     * Delete multiple units by their IDs.
     * @param ids - Array of IDs of units to delete.
     */
    const deleteMultipleUnits = (ids: number[]) => {
      units.value = units.value.filter((unit) => !ids.includes(unit.id));
    };

    /**
     * Get all units.
     * @returns All units in the store.
     */
    const getAllUnits = () => {
      return units.value;
    };

    /**
     * Get the total number of units.
     * @returns The count of units in the store.
     */
    const getUnitCount = () => {
      return units.value.length;
    };

    /**
     * Reset the store: clears all units and resets the ID counter.
     */
    const resetStore = () => {
      units.value = [];
      idCounter.value = 1;
    };

    return {
      units,
      createUnit,
      updateUnit,
      deleteUnit,
      deleteMultipleUnits,
      getAllUnits,
      getUnitCount,
      resetStore,
    };
  },
  {
    persist: true, // Persist the units data across page reloads
  },
);

// For use outside of component setup functions
export function useUnitStoreWithout() {
  return useUnitStore(store);
}
