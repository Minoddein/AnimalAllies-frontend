import { Inter } from "next/font/google";

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
                    <Providers>{children}</Providers>
                </AuthProvider>
            </body>
        </html>
    );
}
