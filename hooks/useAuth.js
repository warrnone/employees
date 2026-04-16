"use client";

import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("employee_user");

    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (error) {
        console.error("READ_AUTH_ERROR:", error);
        setUser(null);
      }
    }
  }, []);

  return user;
}