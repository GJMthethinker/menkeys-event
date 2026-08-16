import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Menkeys Event",
  description:
    "La plateforme qui permet de créer, gérer, promouvoir et vivre des événements en un seul endroit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${anton.variable} ${inter.variable} font-sans`}>
        <NavBar />
                  {children}
      </body>
    </html>
  );
}
