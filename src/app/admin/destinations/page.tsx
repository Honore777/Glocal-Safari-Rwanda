import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit, Trash2, Plus, Star } from "lucide-react";

export default async function DestinationsAdminPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function deleteDestination(id: string) {
    "use server";
    await prisma.destination.delete({ where: { id } });
  }

  async function toggleFeatured(id: string, featured: boolean) {
    "use server";
    await prisma.destination.update({
      where: { id },
      data: { featured: !featured },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green">
          Destinations
        </h1>
        <Link
          href="/admin/destinations/new"
          className="bg-safari-green text-white px-6 py-3 rounded-lg hover:bg-safari-green/90 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Destination
        </Link>
      </div>

      <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-safari-green/10">
            <tr>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Name</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Slug</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Country</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Featured</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id} className="border-b border-gray-200 hover:bg-white/50 transition-all duration-200">
                <td className="p-4 font-sans font-medium">{destination.name}</td>
                <td className="p-4 font-sans text-sm text-gray-600">{destination.slug}</td>
                <td className="p-4 font-sans text-sm text-gray-600">{destination.country}</td>
                <td className="p-4">
                  {destination.featured ? (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Normal</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <form action={toggleFeatured.bind(null, destination.id, destination.featured)}>
                      <button
                        type="submit"
                        className="text-yellow-600 hover:text-yellow-700"
                        title={destination.featured ? "Remove from featured" : "Mark as featured"}
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </form>
                    <Link
                      href={`/admin/destinations/${destination.id}/edit`}
                      className="text-safari-green hover:text-safari-green/80"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteDestination.bind(null, destination.id)}>
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {destinations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No destinations yet. Add your first destination!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
