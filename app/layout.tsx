import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "RaceDeck",
  description:
    "RaceDeck — track the full current Formula 1 season schedule, race weekends, and session times in one clean dashboard.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#121217]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
