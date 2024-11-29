"use client";

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import axios, { AxiosError } from "axios";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get<User>("https://mges.tech/api/user", {
        withCredentials: true, 
      });
      setUser(data);
    } catch (error) {
      setUser(null);
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); 
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const payload = {
      resource: "auth",
      action: "login",
      email,
      password,
    };
    try {
      await axios.post("https://mges.tech/api/resources", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      await checkAuth(); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Login failed:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://mges.tech/api/resources",
        { resource: "auth", action: "logout" },
        { withCredentials: true }
      );
      setUser(null); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
