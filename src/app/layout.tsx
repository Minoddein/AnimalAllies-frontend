import React, { Suspense } from "react";

import { Inter } from "next/font/google";

import Loading from "@/app/loading";
import { Providers } from "@/components/providres";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import "@/globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <Suspense fallback={<Loading />}>
                        <Providers>{children}</Providers>
                    </Suspense>
                </AuthProvider>
            </body>
        </html>
    );
}
