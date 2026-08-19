import axios from "axios";
import api from "../api/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const registerUser = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/register`,
    data
  );

  return response.data;
};

export const loginUser = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/login`,
    data
  );

  return response.data;
};

export const deleteAccount = async (password: string) => {
  const response = await api.delete("/auth/account", {
    data: { password },
  });

  return response.data;
};