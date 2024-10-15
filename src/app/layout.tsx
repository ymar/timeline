import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { NavBar } from '@/components/NavBar';
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Welcome to My App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Providers>
          <NavBar />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
