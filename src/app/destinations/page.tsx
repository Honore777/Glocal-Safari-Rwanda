import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

export const revalidate = 3600;

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-widest text-safari-green mb-4">
            Destinations
          </h1>
          <p className="font-sans text-xl text-gray-700 max-w-2xl mx-auto">
            Explore remarkable places across Rwanda and East Africa.
          </p>
        </div>
      </section>

      <section className="py-8 px-4 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <article key={destination.id} className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl overflow-hidden shadow-gold">
              <div className="aspect-[4/3] relative overflow-hidden bg-golden-gradient">
                <Image
                  src={destination.imageUrl || "/images/golden-elephant.jpeg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
                {destination.featured && (
                  <div className="absolute top-4 right-4 bg-safari-green text-white px-3 py-1 rounded-full text-xs font-sans font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-3">
                  <MapPin className="w-4 h-4" />
                  {destination.country}
                </div>
                <h2 className="font-serif text-2xl text-safari-green mb-2">
                  {destination.name}
                </h2>
                <p className="font-sans text-charcoal/70 line-clamp-3">
                  {destination.description}
                </p>
              </div>
            </article>
          ))}
          {destinations.length === 0 && (
            <p className="text-center font-sans text-gray-600 md:col-span-2 lg:col-span-3">No destinations available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
