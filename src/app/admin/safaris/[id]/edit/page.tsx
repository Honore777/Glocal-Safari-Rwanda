import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SafariForm from "@/components/SafariForm";

export default async function EditSafariPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const safari = await prisma.safari.findUnique({
    where: { id },
    include: { itineraries: { orderBy: { day: "asc" } } },
  });

  if (!safari) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Edit Safari
      </h1>
      <SafariForm safari={safari} />
    </div>
  );
}
