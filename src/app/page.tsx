"use client";

import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import WhenWhere from "@/components/WhenWhere";
import GiftSection from "@/components/GiftSection";
import QuizCTA from "@/components/QuizCTA";
import InvitationCTA from "@/components/InvitationCTA";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";

function Slide({ children, tall }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        height: tall ? undefined : "100vh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        overflowY: tall ? "auto" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Make navbar anchor links scroll within the snap container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const target = container.querySelector(`#${id}`);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Navbar />
      <div
        ref={containerRef}
        className="slides-container"
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}
      >
        <Slide><Hero /></Slide>
        <Slide><Countdown /></Slide>
        <Slide><PhotoGallery /></Slide>
        <Slide tall><Timeline /></Slide>
        <Slide tall><WhenWhere /></Slide>
        <Slide><GiftSection /></Slide>
        <Slide><QuizCTA /></Slide>
        <Slide><InvitationCTA /></Slide>
        <Slide><Footer /></Slide>
      </div>
    </>
  );
}

