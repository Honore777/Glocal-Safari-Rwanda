"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.refresh();
        router.replace("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/golden-elephant.jpeg"
        alt="Safari background"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-charcoal/75" />

      {/* Login form card */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-cream/90 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 shadow-gold-lg">
          <div className="text-center mb-8">
            <Image
              src="/images/logo.jpeg"
              alt="Glocal Rwanda Safaris"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full"
            />
            <h1 className="font-serif text-3xl text-safari-green mb-2">Admin Login</h1>
            <p className="font-sans text-sm text-charcoal/70">Glocal Rwanda Safaris</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-sans text-sm font-medium text-charcoal mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
                placeholder="Enter admin email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-sans text-sm font-medium text-charcoal mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 font-sans text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-safari-green text-white font-sans font-semibold py-3 rounded-lg hover:bg-safari-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-safari-green hover:underline font-sans text-sm">
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
