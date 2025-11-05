import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "RankCatalyst - ITS-Aware JEE Chemistry Quiz",
  description: "Adaptive learning platform for JEE Chemistry preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://webgazer.cs.brown.edu/webgazer.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}

