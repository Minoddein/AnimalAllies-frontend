import {Inter} from "next/font/google";

import {Providers} from "@/components/providres";
import {AuthProvider} from "@/contexts/auth/AuthContext";
import "@/styles/globals.css";
import React, {Suspense} from "react";
import Loading from "@/app/loading";

const inter = Inter({subsets: ["latin", "cyrillic"]});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
        <body className={inter.className}>
        <AuthProvider>
            <Suspense fallback={<Loading/>}>
                <Providers>{children}</Providers>
            </Suspense>
        </AuthProvider>
        </body>
        </html>
    );
}
