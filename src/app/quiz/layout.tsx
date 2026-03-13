import type { Metadata } from "next";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "¿Cuánto nos conoces? · Vale & Edu",
  description: "El quiz de los novios. Demuestra cuánto sabes sobre Vale y Edu.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
