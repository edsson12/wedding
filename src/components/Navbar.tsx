"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const navLinks = [
    { href: "#countdown", label: t("nav.bigDay") },
    { href: "#fotos", label: t("nav.photos") },
    { href: "#timeline", label: t("nav.program") },
    { href: "#cuando-donde", label: t("nav.venue") },
    { href: "#regalo", label: t("nav.gift") },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // The page scroll lives inside a fixed container div, not on window.
    // Use IntersectionObserver on the hero section instead.
    const hero = document.querySelector<HTMLElement>('section');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[--color-blush]/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`font-script italic text-2xl sm:text-3xl transition-colors duration-300 ${
              scrolled ? "text-[--color-wine]" : "text-white"
            }`}
          >
            Vale &amp; Edu
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLink(link.href)}
                className={`cursor-pointer font-lato text-xs tracking-widest uppercase transition-colors duration-200 ${
                  scrolled
                    ? "text-gray-600 hover:text-[--color-wine]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            <LanguageSwitcher dark={scrolled} />
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 -mr-2"
            aria-label="Abrir menú"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[--color-wine]" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[--color-wine]" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[--color-wine]" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[56px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-[--color-blush]/40 md:hidden"
          >
            <nav className="flex flex-col py-4">
              <div className="flex justify-center gap-2 py-3 border-b border-[--color-blush]/30 mb-1">
                <LanguageSwitcher dark />
              </div>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleLink(link.href)}
                  className="cursor-pointer px-8 py-4 text-left font-lato text-xs tracking-widest uppercase text-gray-700 hover:text-[--color-wine] hover:bg-[--color-cream] transition-colors duration-150"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
