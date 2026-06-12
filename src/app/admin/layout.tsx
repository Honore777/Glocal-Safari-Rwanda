"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, MessageSquare, HelpCircle, Info, MapPin, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, pathname, router]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-sans text-charcoal">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/safaris", label: "Safaris", icon: MapPin },
    { href: "/admin/blogs", label: "Blogs", icon: FileText },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/admin/about", label: "About Us", icon: Info },
    { href: "/admin/destinations", label: "Destinations", icon: MapPin },
    { href: "/admin/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-charcoal text-cream shadow-gold-lg border-r-2 border-golden-mid/30 flex flex-col">
        <div className="p-6 border-b border-golden-mid/20">
          <h1 className="font-serif text-2xl font-bold text-cream">Glocal Rwanda Safaris</h1>
          <p className="text-xs text-golden-light uppercase tracking-[0.2em] mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-golden-gradient text-charcoal font-semibold shadow-gold"
                        : "text-cream/80 hover:bg-charcoal-light hover:text-sunset-glow"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-golden-mid/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-cream/80 hover:bg-charcoal-light hover:text-sunset-glow transition-all duration-200 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
