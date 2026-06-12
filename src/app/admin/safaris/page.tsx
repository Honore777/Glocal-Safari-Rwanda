import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function SafarisAdminPage() {
  const safaris = await prisma.safari.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { inquiries: true, itineraries: true } } },
  });

  async function deleteSafari(id: string) {
    "use server";
    await prisma.safari.delete({ where: { id } });
    revalidatePath("/admin/safaris");
    revalidatePath("/safaris");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green">
            Safaris
          </h1>
          <p className="text-charcoal/60 mt-1">Manage your safari packages and daily itineraries</p>
        </div>
        <Link
          href="/admin/safaris/new"
          className="bg-golden-gradient text-charcoal px-6 py-3 rounded-lg hover:shadow-gold hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add New Safari
        </Link>
      </div>

      <div className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl overflow-hidden shadow-gold">
        <table className="w-full">
          <thead className="bg-charcoal text-cream">
            <tr>
              <th className="text-left p-4 font-sans text-sm font-semibold">Safari</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Duration</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Price</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Days Added</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Featured</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Inquiries</th>
              <th className="text-left p-4 font-sans text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safaris.map((safari) => (
              <tr key={safari.id} className="border-b border-golden-mid/15 hover:bg-golden-light/10 transition-all duration-200">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-golden-light/30 flex-shrink-0">
                      {safari.imageUrl && (
                        <Image src={safari.imageUrl} alt={safari.title} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-charcoal">{safari.title}</p>
                      <p className="font-sans text-xs text-charcoal/50">{safari.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-sans text-sm text-charcoal/80">{safari.duration} days</td>
                <td className="p-4 font-sans text-sm font-semibold text-golden-dark">${safari.price}</td>
                <td className="p-4 font-sans text-sm text-charcoal/80">
                  {safari._count.itineraries} / {safari.duration}
                </td>
                <td className="p-4">
                  {safari.featured ? (
                    <span className="bg-golden-gradient text-charcoal text-xs px-3 py-1 rounded-full font-semibold">Featured</span>
                  ) : (
                    <span className="bg-charcoal/10 text-charcoal/60 text-xs px-3 py-1 rounded-full">No</span>
                  )}
                </td>
                <td className="p-4 font-sans text-sm text-charcoal/80">{safari._count.inquiries}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/safaris/${safari.slug}`}
                      target="_blank"
                      className="text-charcoal/50 hover:text-golden-dark transition-colors"
                      title="View live"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/safaris/${safari.id}/edit`}
                      className="text-golden-dark hover:text-golden-mid transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteSafari.bind(null, safari.id)}>
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-700 transition-colors flex"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {safaris.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-charcoal/50">
                  No safaris yet. Create your first safari!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
