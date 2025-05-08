"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Toaster } from "@/components/providers/toaster";
import Loader from "@/components/loader/Loader";
import ErrorBoundary from "@/hooks/errorBoundary";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import AuthProvider from "@/providers/AuthProvider";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Custom>{children}</Custom>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  return (
    <>
      <ErrorBoundary>{isLoading ? <Loader /> : <>{children} </>}</ErrorBoundary>
    </>
  );
}; 