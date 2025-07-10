import type { User, CreateUserRequest, UpdateUserRequest } from "../model/types";

const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const usersApi = {
  async getAll(): Promise<User[]> {
    try {
      const stored = localStorage.getItem('users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },

  async create(request: CreateUserRequest): Promise<User> {
    const user: User = {
      id: generateId(),
      ...request,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const users = await this.getAll();
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async update(request: UpdateUserRequest): Promise<User> {
    try {
      const users = await this.getAll();
      const index = users.findIndex(u => u.id === request.id);
      
      if (index === -1) {
        throw new Error('User not found');
      }

      users[index] = {
        ...users[index],
        ...request,
        updatedAt: Date.now(),
      };

      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const users = await this.getAll();
      const filtered = users.filter(u => u.id !== id);
      localStorage.setItem('users', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async toggleActive(id: string): Promise<User> {
    try {
      const users = await this.getAll();
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return await this.update({
        id,
        isActive: !user.isActive,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  async createDemoUsers(): Promise<void> {
    const demoUsers: CreateUserRequest[] = [
      {
        userFullname: "Александр",
        userSurname: "Иванов",
        userPatronymic: "Петрович",
        userEmail: "ivanov@example.com",
        userPhone: "+7 (999) 123-45-67",
        userRole: "admin",
      },
      {
        userFullname: "Мария",
        userSurname: "Петрова",
        userPatronymic: "Сергеевна",
        userEmail: "petrova@example.com",
        userPhone: "+7 (999) 765-43-21",
        userRole: "manager",
      },
      {
        userFullname: "Дмитрий",
        userSurname: "Сидоров",
        userPatronymic: "Владимирович",
        userEmail: "sidorov@example.com",
        userPhone: "+7 (999) 111-22-33",
        userRole: "user",
      }
    ];

    for (const userRequest of demoUsers) {
      await this.create(userRequest);
    }
  }
}; 