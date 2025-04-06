import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/providres";
import siteMetadata from "@/conf/site-metadata";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: { default: siteMetadata.name, template: `%s | ${siteMetadata.name}` },
    applicationName: siteMetadata.name,
    description: siteMetadata.description,
    authors: [siteMetadata.authors],
    // icons: [{ url: siteMetadata.appIcon.src, sizes: siteMetadata.appIcon.sizes }],
};

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
