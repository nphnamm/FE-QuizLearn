"use client";
import type { Metadata } from "next";
import { Inter, Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/providers/toaster";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/hooks/errorBoundary";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import AuthProvider from "@/providers/AuthProvider";

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
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
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
        </ReduxProvider>
      </body>
    </html>
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
