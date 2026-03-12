import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Montserrat, Parisienne } from "next/font/google";
import I18nProvider from "@/components/I18nProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Vale & Edu · Nuestra Boda · 25.07.2026",
  description: "Os invitamos a celebrar nuestra boda el 25 de julio de 2026 en Zaragoza. Confirma tu asistencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${parisienne.variable} ${cormorant.variable} ${lato.variable} antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
