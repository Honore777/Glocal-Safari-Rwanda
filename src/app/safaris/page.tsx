import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function SafarisPage() {
  const safaris = await prisma.safari.findMany({
    orderBy: { featured: "desc" },
  });

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-widest text-safari-green mb-4">
            Our Safaris
          </h1>
          <p className="font-sans text-xl text-gray-700 max-w-2xl mx-auto">
            Discover extraordinary wildlife experiences across East Africa
          </p>
        </div>
      </section>

      {/* Safari Grid */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safaris.map((safari: { id: string; slug: string; title: string; description: string; duration: number; price: number; featured: boolean; imageUrl: string | null }) => (
              <Link
                key={safari.id}
                href={`/safaris/${safari.slug}`}
                className="group bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-golden-light to-golden-dark relative overflow-hidden">
                  <Image
                    src={safari.imageUrl || "/images/golden-elephant.jpeg"}
                    alt={safari.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {safari.featured && (
                    <div className="absolute top-4 right-4 bg-safari-green text-white px-3 py-1 rounded-full text-xs font-sans font-medium z-10">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {safari.duration} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Uganda
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-safari-green mb-2 group-hover:text-safari-green/80 transition-colors">
                    {safari.title}
                  </h3>
                  <p className="font-sans text-gray-600 mb-4 line-clamp-2">
                    {safari.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl text-safari-green">
                      ${safari.price}
                    </span>
                    <span className="inline-flex items-center gap-2 text-safari-green font-medium group-hover:gap-3 transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {safaris.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-gray-600">No safaris available yet</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
