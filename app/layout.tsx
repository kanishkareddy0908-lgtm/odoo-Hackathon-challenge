import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VendorBridge — Procurement & Vendor Management ERP",
  description: "AI-powered procurement and vendor management platform. Streamline RFQs, quotations, purchase orders, and vendor relationships with intelligent automation.",
  keywords: "procurement, vendor management, ERP, purchase orders, RFQ, quotations",
  authors: [{ name: "VendorBridge Team" }],
  openGraph: {
    title: "VendorBridge ERP",
    description: "AI-powered Procurement & Vendor Management",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}
