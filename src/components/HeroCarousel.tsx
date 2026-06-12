"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    src: "/images/golden-elephant.jpeg",
    headlineTop: "WHERE THE SUN",
    headlineBottom: "RULES THE PLAINS",
    sub: "Track the Big Five under a golden Rwandan sky. An unforgettable safari experience awaits.",
  },
  {
    src: "/images/bonding-elephants.jpeg",
    headlineTop: "GLOBAL + LOCAL",
    headlineBottom: "AUTHENTIC AFRICA",
    sub: "Your authentic African adventure starts here, guided by those who call these plains home.",
  },
  {
    src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=2200&q=85",
    headlineTop: "LIONS AT",
    headlineBottom: "GOLDEN HOUR",
    sub: "Feel the power of Africa's wild heart as lions move through the warm savannah light.",
  },
  {
    src: "/images/chimpanzee eating photo.jpeg",
    headlineTop: "PRIMATE",
    headlineBottom: "FOREST TREKS",
    sub: "Step into Rwanda's green forests for unforgettable chimpanzee and primate encounters.",
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.headlineBottom}
            fill
            priority={index === 0}
            className={`object-cover ${index === active ? "animate-ken-burns" : ""}`}
          />
          {/* Warm sunset tint + dark overlay for readability */}
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-sunset-amber/30 via-transparent to-golden-deep/30 mix-blend-multiply" />
        </div>
      ))}

      {/* Hero content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl ml-auto text-right md:pr-4">
          <h1
            key={active}
            className="font-serif uppercase leading-[0.95] animate-fade-up"
          >
            <span className="block text-4xl sm:text-5xl md:text-7xl font-light text-cream tracking-wide drop-shadow-[0_2px_20px_rgba(255,210,125,0.45)]">
              {slides[active].headlineTop.split(" ").map((word, i) =>
                word === "SUN" ? (
                  <span key={i} className="font-bold text-sunset-glow">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-7xl font-bold text-cream tracking-wide drop-shadow-[0_2px_20px_rgba(255,210,125,0.45)]">
              {slides[active].headlineBottom.split(" ").map((word, i) =>
                word === "PLAINS" ? (
                  <span key={i} className="text-sunset-glow">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </span>
          </h1>
          <p className="mt-6 font-sans text-base md:text-lg text-cream/90 max-w-lg ml-auto leading-relaxed">
            {slides[active].sub}
          </p>
          <div className="mt-8 flex justify-end">
            <Link
              href="/safaris"
              className="group inline-flex items-center gap-3 bg-golden-gradient text-charcoal font-sans font-semibold px-8 py-4 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105"
            >
              EXPLORE DESTINATIONS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === active ? "w-10 bg-sunset-glow" : "w-2 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
