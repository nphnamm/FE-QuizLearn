"use client";

import type { Metadata } from "next";
import { Inter, Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/providers/toaster";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/hooks/errorBoundary";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "QuizLearn",
//   description: "Learn with quiz",
// };

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <Custom>{children}</Custom>

              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => {
    if (isAuthenticated === undefined) {
      <Loader />;
    }
    setIsLoading(false);
  }, []);
  return (
    <>
      <ErrorBoundary>{isLoading ? <Loader /> : <>{children}</>}</ErrorBoundary>
    </>
  );
};