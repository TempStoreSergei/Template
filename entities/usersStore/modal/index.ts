import { ref } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";

export type User = {
  id: number; // Auto-generated unique ID
  userFirstName: string; // User's first name
  userPatronymic: string; // User's patronymic name
  userSurname: string; // User's surname
};

export const useUserStore = defineStore(
  "users",
  () => {
    const users = ref<User[]>([]); // Array of users
    const idCounter = ref(1); // Counter for generating unique IDs

    /**
     * Add a new user to the store.
     * @param user - User object without an ID.
     */
    const createUser = (user: Omit<User, "id">) => {
      console.log(idCounter.value);
      const newUser = { id: idCounter.value++, ...user };
      users.value.push(newUser);
      return newUser;
    };

    /**
     * Update an existing user by their ID.
     * @param id - ID of the user to update.
     * @param updatedData - Updated properties for the user.
     */
    const updateUser = (id: number, updatedData: Partial<User>) => {
      const userIndex = users.value.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          ...updatedData,
        };
      }
    };

    /**
     * Delete a user by their ID.
     * @param id - ID of the user to delete.
     */
    const deleteUser = (id: number) => {
      users.value = users.value.filter((user) => user.id !== id);
    };

    /**
     * Delete multiple users by their IDs.
     * @param ids - Array of IDs of users to delete.
     */
    const deleteMultipleUsers = (ids: number[]) => {
      users.value = users.value.filter((user) => !ids.includes(user.id));
    };

    /**
     * Get all users.
     * @returns All users in the store.
     */
    const getAllUsers = () => {
      return users.value;
    };

    /**
     * Get the total number of users.
     * @returns The count of users in the store.
     */
    const getUserCount = () => {
      return users.value.length;
    };

    /**
     * Reset the store: clears all users and resets the ID counter.
     */
    const resetStore = () => {
      users.value = [];
      idCounter.value = 1;
    };

    return {
      users,
      createUser,
      updateUser,
      deleteUser,
      deleteMultipleUsers,
      getAllUsers,
      getUserCount,
      resetStore,
    };
  },
  {
    persist: true, // Persist the users data across page reloads
  },
);

// For use outside of component setup functions
export function useUserStoreWithout() {
  return useUserStore(store);
}
