"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/lib/types";

const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all users once to simulate auth checking
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    // In a real app, you'd have an API endpoint for this.
    const res = await fetch('/api/users?all=true');
    const data = await res.json();
    setAllUsers(data.users);
    return data.users;
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  useEffect(() => {
    if (allUsers.length === 0 && loading) {
       // if we have no users, we're not done loading yet
       // but if we are not loading, it means there are no users in DB
       return; 
    }
    try {
      const storedUserId = localStorage.getItem("loggedInUser");
      if (storedUserId) {
        const currentUser = allUsers.find((u) => u.id === storedUserId);
        setUser(currentUser || null);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [allUsers, loading]);

  const login = useCallback(
    async (email: string, password?: string) => {
      let userToLogin = allUsers.find((u) => u.email === email && u.password === password);

      // If user is not found, refresh the list and try again.
      // This handles the case where a user signs up and immediately tries to log in.
      if (!userToLogin) {
        const freshUsers = await fetchUsers();
        userToLogin = freshUsers.find((u: User) => u.email === email && u.password === password);
      }

      if (userToLogin) {
        try {
          localStorage.setItem("loggedInUser", userToLogin.id); // Store the unique ID
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
    [router, allUsers, fetchUsers]
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
      if (loading) return; 
      
      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("loggedInUser") : null;
      
      if (!storedUserId) {
        router.replace("/");
        return;
      }
      
      const currentUser = allUsers.find((u) => u.id === storedUserId);
      if (!currentUser || (role && currentUser.role !== role)) {
         logout(); // If user is invalid or role doesn't match, log them out
      }
    },
    [router, loading, allUsers, logout]
  );

  return { user, loading, login, logout, checkAuth };
};

export default useMockAuth;
