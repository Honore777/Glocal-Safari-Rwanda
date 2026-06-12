import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream border-t-4 border-golden-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center overflow-hidden ring-2 ring-golden-mid/40">
                <Image
                  src="/images/logo.jpeg"
                  alt="Glocal Rwanda Safaris"
                  width={48}
                  height={48}
                  className="object-cover scale-150"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Glocal Rwanda Safaris</h3>
                <p className="text-xs text-golden-light uppercase tracking-[0.2em]">Premium Safari Experiences</p>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-4">
              Experience the magic of Rwanda with our expertly crafted safari tours. From gorilla trekking to wildlife adventures, we create unforgettable memories.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  href: "https://www.facebook.com/share/1EcjWvE5uT/",
                  label: "Facebook",
                  icon: Facebook,
                },
                {
                  href: "https://www.instagram.com/glocal_rwanda_safaris?utm_source=qr&igsh=MXJvbW4zYmtzaTM4Ng==",
                  label: "Instagram",
                  icon: Instagram,
                },
                {
                  href: "https://www.linkedin.com/company/glocal-rwanda-safaris/?viewAsMember=true",
                  label: "LinkedIn",
                  icon: Linkedin,
                },
                {
                  href: "https://x.com/GlocalRwanda",
                  label: "X",
                  icon: Twitter,
                },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-charcoal-light px-3 py-2 text-cream/80 hover:bg-golden-gradient hover:text-charcoal transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-golden-light">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/safaris" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  Safaris
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-golden-light">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-golden-mid" />
                <span className="text-cream/70 text-sm">
                  Kigali, Rwanda<br />
                  East Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-golden-mid" />
                <a href="tel:+250788123456" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  +250 788 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-golden-mid" />
                <a href="mailto:info@glocalrwandasafaris.com" className="text-cream/70 hover:text-sunset-glow transition-colors text-sm">
                  info@glocalrwandasafaris.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-golden-light">Business Hours</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-golden-mid" />
                <div className="text-cream/70 text-sm">
                  <p>Monday - Friday</p>
                  <p>8:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-golden-mid" />
                <div className="text-cream/70 text-sm">
                  <p>Saturday</p>
                  <p>9:00 AM - 4:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-golden-mid" />
                <div className="text-cream/70 text-sm">
                  <p>Sunday</p>
                  <p>Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-golden-mid/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/50 text-sm">
              © {new Date().getFullYear()} Glocal Rwanda Safaris. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-cream/50 hover:text-sunset-glow transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-cream/50 hover:text-sunset-glow transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-cream/50 hover:text-sunset-glow transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
