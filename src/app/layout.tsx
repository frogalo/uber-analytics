import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uber Analytics",
  description: "Uber Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto py-2">
          {/* Header or Navigation (Optional) */}
          <header className="mb-4">
            <h1 className="text-2xl font-bold">
              <Link href="/">
                Uber Analytics
              </Link>

            </h1>
          </header>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer (Optional) */}
          <footer className=" text-center text-gray-500">
            <p>&copy; 2025 Uber Analytics</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
