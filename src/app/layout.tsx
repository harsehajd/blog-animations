import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Browser Meltdown",
  description: "Interactive browser scale meltdown",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} style={{ margin: 0, padding: 0, overflow: "hidden" }}>
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }} className={inter.className}>
        {children}
      </body>
    </html>
  );
}

