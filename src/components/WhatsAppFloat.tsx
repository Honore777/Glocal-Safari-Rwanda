"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  
  const getMessage = () => {
    if (pathname.startsWith("/safaris/")) {
      const safariName = pathname.replace("/safaris/", "").replace(/-/g, " ");
      return `Hi! I am looking to customize the ${safariName}...`;
    }
    return "Hi! I'm interested in booking a safari experience.";
  };

  const whatsappPhone = process.env.WHATSAPP_PHONE || "250791765545";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(getMessage())}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
