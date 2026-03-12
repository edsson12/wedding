import type { Metadata } from "next";
import { Cormorant_Garamond, Lato, Montserrat, Parisienne } from "next/font/google";
import I18nProvider from "@/components/I18nProvider";
import "../globals.css";

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
  title: "¿Cuánto nos conoces? · Vale & Edu",
  description: "El quiz de los novios. Demuestra cuánto sabes sobre Vale y Edu.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${parisienne.variable} ${cormorant.variable} ${lato.variable}`}
        style={{ margin: 0, background: "#FBF5EF" }}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
