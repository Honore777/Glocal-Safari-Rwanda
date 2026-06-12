import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, MapPin, Camera, Tent, Compass, Star } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rwanda Safari Tours & Gorilla Trekking",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

const categories = [
  {
    icon: Compass,
    title: "Private Safaris",
    desc: "Tailored journeys with your own expert guide.",
  },
  {
    icon: Camera,
    title: "Photographic Tours",
    desc: "Capture the Big Five in golden light.",
  },
  {
    icon: Tent,
    title: "Luxury Lodging",
    desc: "Rest under the stars in elegant comfort.",
  },
];

export default async function HomePage() {
  const featuredSafaris = await prisma.safari.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      {/* Category cards floating section */}
      <section className="relative z-30 -mt-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group bg-charcoal/90 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-6 shadow-gold hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-golden-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <cat.icon className="w-7 h-7 text-charcoal" />
              </div>
              <h3 className="font-serif text-2xl text-cream mb-2">{cat.title}</h3>
              <p className="font-sans text-sm text-cream/70 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro / Global + Local */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans uppercase tracking-[0.3em] text-golden-dark text-sm mb-4">
            Global + Local
          </p>
          <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-safari-green mb-6 leading-tight">
            Glocal Rwanda Safaris
          </h2>
          <p className="font-sans text-lg text-charcoal-light/80 max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in the breathtaking majesty of Africa. From gorilla trekking in misty
            volcanoes to golden-hour game drives, we craft authentic adventures led by those who
            know these lands best.
          </p>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent via-golden-light/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="font-sans uppercase tracking-[0.3em] text-golden-dark text-sm mb-2">
                Curated Journeys
              </p>
              <h2 className="font-serif text-4xl md:text-5xl uppercase tracking-wide text-safari-green">
                Featured Experiences
              </h2>
            </div>
            <Link
              href="/safaris"
              className="inline-flex items-center gap-2 text-golden-dark font-semibold hover:gap-3 transition-all"
            >
              View All Safaris
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {featuredSafaris.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSafaris.map((safari) => (
                <Link
                  key={safari.slug}
                  href={`/safaris/${safari.slug}`}
                  className="group bg-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-gold-lg transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={safari.imageUrl}
                      alt={safari.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    <div className="absolute top-4 right-4 bg-golden-gradient text-charcoal font-bold text-sm px-3 py-1 rounded-full shadow-gold">
                      ${safari.price}/day
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-charcoal-light/70 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-golden-dark" />
                        {safari.duration} Days
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-safari-green mb-2 group-hover:text-golden-dark transition-colors">
                      {safari.title}
                    </h3>
                    <p className="font-sans text-charcoal-light/70 text-sm mb-4 leading-relaxed">
                      {safari.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-golden-dark font-semibold group-hover:gap-3 transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-sans text-charcoal-light/70 text-lg">
                No featured safaris yet. Mark safaris as featured in the admin panel.
              </p>
              <Link
                href="/safaris"
                className="inline-flex items-center gap-2 text-golden-dark font-semibold mt-4 hover:gap-3 transition-all"
              >
                View All Safaris
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative py-28 px-4 mt-12 overflow-hidden">
        <Image
          src="/images/golden-elephant.jpeg"
          alt="Safari adventure"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4 text-sunset-glow">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-sunset-glow" />
            ))}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl uppercase text-cream mb-6 leading-tight drop-shadow-[0_2px_20px_rgba(255,210,125,0.4)]">
            Your Authentic African <span className="text-sunset-glow">Adventure</span> Starts Here
          </h2>
          <p className="font-sans text-cream/85 text-lg mb-8 max-w-xl mx-auto">
            Let us craft a once-in-a-lifetime safari tailored to your dreams.
          </p>
          <Link
            href="/safaris"
            className="inline-flex items-center gap-3 bg-golden-gradient text-charcoal font-sans font-semibold px-10 py-4 rounded-full shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105"
          >
            Book Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
