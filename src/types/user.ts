export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'ADMIN' | 'HR' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'HR' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  fullName?: string;
  role?: 'ADMIN' | 'HR' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
} 