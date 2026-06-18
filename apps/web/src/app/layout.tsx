import type { Metadata } from "next";
import { Cinzel, Rajdhani } from "next/font/google";
import "./globals.css";

const titleFont = Cinzel({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["500", "700"],
});

const bodyFont = Rajdhani({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "賽博功德機 · Cyber Merit Machine",
  description: "輕觸積德，功德無量 — 一念清淨，靜心積累功德的賽博功德機。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={`${titleFont.variable} ${bodyFont.variable} app-body`}>
        {children}
      </body>
    </html>
  );
}
