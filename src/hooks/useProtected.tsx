"use client";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import userAuth from "./useAuth";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { isLoading } = useLoadUserQuery({});
  const isAuthenticated = userAuth();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Once loadUser query is no longer loading, we're ready to check authentication
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);
  
  // Show nothing while checking authentication
  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // After loadUser completes, check authentication
  return isAuthenticated ? children : redirect("/");
}
