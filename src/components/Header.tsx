"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/safaris", label: "Safaris" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/destinations", label: "Destinations" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-gold py-2"
          : "bg-gradient-to-b from-charcoal/70 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cream/95 flex items-center justify-center overflow-hidden ring-2 ring-golden-mid/40">
              <Image
                src="/images/logo.jpeg"
                alt="Glocal Rwanda Safaris"
                width={48}
                height={48}
                className="object-cover scale-150"
              />
            </div>
            <div>
              <h1 className="font-serif text-xl md:text-2xl font-bold text-cream tracking-wide leading-tight">
                Glocal Rwanda Safaris
              </h1>
              <p className="text-[10px] md:text-xs text-golden-light font-sans uppercase tracking-[0.2em]">
                Premium Safari Experiences
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm uppercase tracking-wide text-cream/90 hover:text-sunset-glow transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="bg-golden-gradient text-charcoal px-6 py-2 rounded-full font-sans font-semibold text-sm hover:scale-105 hover:shadow-gold transition-all duration-300"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-cream hover:bg-charcoal-light/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-golden-mid/20 bg-charcoal/95 backdrop-blur-md rounded-b-2xl">
            <div className="flex flex-col gap-4 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans uppercase tracking-wide text-cream/90 hover:text-sunset-glow transition-colors duration-200 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="bg-golden-gradient text-charcoal px-6 py-2 rounded-full font-sans font-semibold hover:scale-105 transition-all duration-300 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
