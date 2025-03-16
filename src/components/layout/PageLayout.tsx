"use client";

import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { toggleSidebar } from "../../../redux/features/layout/layoutSlice";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state: RootState) => state.layout);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 pt-16",
          isSidebarOpen ? "pl-64" : "pl-20",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
} 