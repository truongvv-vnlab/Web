"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import UserProvider from "@/context/userContext";
import { Toaster } from "sonner";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              <UserProvider>
                {children}
                <Toaster position="bottom-right" />
              </UserProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
