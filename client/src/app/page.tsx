"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "@/app/dashboard/page";
import Login from "@/app/login/page";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to not authenticated

  // Check if the user is authenticated (for example, by checking for a token)
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Assume authToken is stored in localStorage
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/Login"); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, router]);

  // If not authenticated, render login page
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated, render dashboard
  return <Dashboard />;
}