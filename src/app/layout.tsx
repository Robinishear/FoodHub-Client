import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import NextTopLoader from 'nextjs-toploader';
import { AOSProvider } from "@/components/shared/AOSProvider";
import { AIChatbox } from "@/components/shared/AIChatbox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodHub | Discover & Order Delicious Meals",
  description: "A premium food ordering platform with three roles: Customer, Provider, and Admin.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`} suppressHydrationWarning>
        <NextTopLoader
          color="#FF5200"
          initialPosition={0.08}
          crawlSpeed={100}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FF5200"
          zIndex={99999}
          showAtBottom={false}
        />
        <AuthProvider>
          <CartProvider>
            <AOSProvider>
              <Toaster position="top-right" />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="grow">{children}</main>
                <Footer />
                <AIChatbox />
              </div>
            </AOSProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}