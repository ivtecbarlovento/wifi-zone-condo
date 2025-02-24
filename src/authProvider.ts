import type { AuthProvider } from "@refinedev/core";
import axios from 'axios';
require ('dotenv').config();

export const TOKEN_KEY = "refine-auth";

export const URL_API = process.env.URL_API;

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    try {
      const response = await axios.post(URL_API + "/auth/login", {
        username: username || email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem(TOKEN_KEY, username || email);
        return {
          success: true,
          redirectTo: "/clients",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: token,
        
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};