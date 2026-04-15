import api from "@/lib/axios";
import { User } from "@/types";

type AuthCredentials = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?:
    | "CUSTOMER"
    | "PROVIDER"
    | "ADMIN"
    | "MANAGER"
    | "ORGANIZER";
  shopName?: string;
  address?: string;
  cuisine?: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post("/auth/register", data);
    return response.data.data as AuthResponse;
  },

  login: async (credentials: AuthCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data.data as AuthResponse;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data.data as User;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch("/auth/update-profile", data);
    return response.data.data as User;
  },
};
