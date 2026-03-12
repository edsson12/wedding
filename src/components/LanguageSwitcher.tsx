"use client";

import { useTranslation } from "react-i18next";
import { setLang } from "@/i18n";

const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

export default function LanguageSwitcher({ dark }: { dark?: boolean }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.split("-")[0] ?? "es";

  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, label }) => {
        const active = current === code;
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            className="font-lato text-[10px] tracking-widest px-2 py-1 rounded-full border transition-all duration-200"
            style={{
              borderColor: active
                ? dark ? "#9B6B7E" : "rgba(255,255,255,0.7)"
                : dark ? "#e2c5cc" : "rgba(255,255,255,0.25)",
              background: active
                ? dark ? "#9B6B7E" : "rgba(255,255,255,0.22)"
                : "transparent",
              color: active
                ? dark ? "#fff" : "#fff"
                : dark ? "#9B6B7E" : "rgba(255,255,255,0.55)",
              fontWeight: active ? 700 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
