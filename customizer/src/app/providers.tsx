"use client"
import React from 'react'
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <NextUIProvider className="text-black">
        <main>{children}</main>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
