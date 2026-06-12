import { prisma } from "@/lib/prisma";
import InquiryForm from "@/components/InquiryForm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const safaris = await prisma.safari.findMany({
    select: { slug: true },
  });
  return safaris.map((safari: { slug: string }) => ({ slug: safari.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const safari = await prisma.safari.findUnique({
    where: { slug },
  });
  return {
    title: safari?.title || "Safari",
    description: safari?.description,
    alternates: {
      canonical: `/safaris/${slug}`,
    },
    openGraph: {
      title: safari?.title || "Safari",
      description: safari?.description,
      url: `/safaris/${slug}`,
      images: safari?.imageUrl ? [safari.imageUrl] : ["/images/golden-elephant.jpeg"],
    },
  };
}

export default async function SafariPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [safari, allSafaris] = await Promise.all([
    prisma.safari.findUnique({
      where: { slug },
      include: {
        itineraries: {
          orderBy: { day: "asc" },
        },
      },
    }),
    prisma.safari.findMany({
      select: { id: true, title: true, slug: true, imageUrl: true, duration: true, price: true },
    }),
  ]);

  if (!safari) notFound();

  const otherSafaris = allSafaris.filter((s) => s.id !== safari.id).slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <Image
          src={safari.imageUrl || "/images/golden-elephant.jpeg"}
          alt={safari.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-12">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-cream mb-4 drop-shadow-[0_2px_20px_rgba(255,210,125,0.45)]">
            {safari.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-cream/90">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sunset-glow" />
              {safari.duration} Days
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sunset-glow" />
              Rwanda
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sunset-glow" />
              Small Groups
            </span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xl text-charcoal/85 leading-relaxed">
            {safari.description}
          </p>
          <div className="mt-8 inline-flex items-baseline gap-2 bg-golden-gradient text-charcoal px-6 py-3 rounded-full shadow-gold">
            <span className="text-3xl font-serif font-bold">${safari.price}</span>
            <span className="text-sm font-sans">per person</span>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans uppercase tracking-[0.3em] text-golden-dark text-sm mb-2 text-center">
            Day by Day
          </p>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-safari-green mb-12 text-center">
            Your Itinerary
          </h2>
          <div className="space-y-10">
            {safari.itineraries.map((item: { id: string; day: number; title: string; content: string; imageUrl: string | null }, index: number) => (
              <div
                key={item.id}
                className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-6 bg-cream/70 backdrop-blur-md border border-golden-mid/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-gold-lg transition-all duration-300`}
              >
                {item.imageUrl && (
                  <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className={`flex-1 p-6 md:p-8 ${!item.imageUrl ? "md:w-full" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-golden-gradient text-charcoal font-serif text-lg font-bold shadow-gold">
                      {item.day}
                    </span>
                    <span className="font-sans uppercase tracking-wide text-golden-dark text-sm">
                      Day {item.day}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-safari-green mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-charcoal/75 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wide text-safari-green mb-8 text-center">
            Book Your Safari
          </h2>
          <InquiryForm safariSlug={safari.slug} safariTitle={safari.title} />
        </div>
      </section>

      {/* Quick Links to Other Safaris */}
      {otherSafaris.length > 0 && (
        <section className="py-16 px-4 bg-golden-light/20">
          <div className="max-w-6xl mx-auto">
            <p className="font-sans uppercase tracking-[0.3em] text-golden-dark text-sm mb-2 text-center">
              Explore More
            </p>
            <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wide text-safari-green mb-12 text-center">
              Other Safaris
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherSafaris.map((other) => (
                <Link
                  key={other.id}
                  href={`/safaris/${other.slug}`}
                  className="group bg-cream/80 backdrop-blur-md border border-golden-mid/25 rounded-2xl overflow-hidden shadow-lg hover:shadow-gold-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={other.imageUrl || "/images/golden-elephant.jpeg"}
                      alt={other.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-safari-green mb-2 line-clamp-2">
                      {other.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-charcoal/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {other.duration}d
                      </span>
                      <span className="font-semibold text-golden-dark">
                        ${other.price}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-safari-green text-sm font-medium group-hover:gap-3 transition-all">
                      View Safari
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
