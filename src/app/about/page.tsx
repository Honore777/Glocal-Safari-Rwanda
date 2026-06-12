import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 3600;

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  return (
    <main className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-widest text-safari-green mb-4">
            {about?.title || "About Glocal Rwanda Safaris"}
          </h1>
          <p className="font-sans text-xl text-gray-700">
            Global standards, local expertise, golden safari memories.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center bg-cream/90 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 shadow-gold">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-golden-gradient">
            <Image
              src={about?.imageUrl || "/images/bonding-elephants.jpeg"}
              alt={about?.title || "About Glocal Rwanda Safaris"}
              fill
              className="object-cover"
            />
          </div>
          <div className="font-sans text-charcoal/80 leading-8 whitespace-pre-line">
            {about?.content || "We create thoughtful Rwanda safari experiences with local knowledge, warm hospitality, and a deep respect for nature and culture."}
          </div>
        </div>
      </section>
    </main>
  );
}
