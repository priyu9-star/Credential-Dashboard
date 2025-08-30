"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/lib/types";
import { users } from "@/lib/data";

const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("loggedInUser");
      if (storedEmail) {
        const currentUser = users.find((u) => u.email === storedEmail);
        setUser(currentUser || null);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (email: string) => {
      const userToLogin = users.find((u) => u.email === email);
      if (userToLogin) {
        try {
          localStorage.setItem("loggedInUser", email);
          setUser(userToLogin);
          if (userToLogin.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Could not access localStorage", error);
        }
      }
      return userToLogin;
    },
    [router]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("loggedInUser");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
  }, [router]);

  const checkAuth = useCallback(
    (role?: UserRole) => {
      if (loading) return; // Don't redirect while loading
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("loggedInUser") : null;
      if (!storedEmail) {
        router.replace("/");
        return;
      }
      
      const currentUser = users.find((u) => u.email === storedEmail);
      if (!currentUser || (role && currentUser.role !== role)) {
        router.replace("/");
      }
    },
    [router, loading]
  );

  return { user, loading, login, logout, checkAuth };
};

export default useMockAuth;
