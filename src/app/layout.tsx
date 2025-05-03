"use client";

import React, { useState } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/providres";
import siteMetadata from "@/conf/site-metadata";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [accessToken, setAccessToken] = useState("");

  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
