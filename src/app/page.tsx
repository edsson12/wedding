"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import WhenWhere from "@/components/WhenWhere";
import InvitationCTA from "@/components/InvitationCTA";
import FloatingPetals from "@/components/FloatingPetals";
import Footer from "@/components/Footer";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative">
      <FloatingPetals isMobile={isMobile} />
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <Timeline />
        <WhenWhere />
        <InvitationCTA />
      </main>
      <Footer />
    </div>
  );
}
