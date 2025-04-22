import React from 'react'
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <NextUIProvider className="text-white">
        <main>{children}</main>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
