"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="system"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        className: "font-sans",
      }}
    />
  );
}
