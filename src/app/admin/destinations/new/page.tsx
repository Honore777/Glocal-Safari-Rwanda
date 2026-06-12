import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

async function createDestination(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const country = formData.get("country") as string;
  const featured = formData.get("featured") === "on";

  if (!name || !slug || !description || !imageUrl || !country) {
    throw new Error("Missing required fields");
  }

  await prisma.destination.create({
    data: {
      name,
      slug,
      description,
      imageUrl,
      country,
      featured,
    },
  });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect("/admin/destinations");
}

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Add New Destination
      </h1>

      <form action={createDestination} className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 max-w-2xl shadow-gold">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
              placeholder="Volcanoes National Park"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Slug (URL-friendly)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
              placeholder="volcanoes-national-park"
            />
            <p className="text-xs text-charcoal/50 mt-1">Use lowercase, hyphens instead of spaces</p>
          </div>

          <div>
            <label htmlFor="country" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
              placeholder="Rwanda"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all resize-none"
              placeholder="Describe the destination..."
            />
          </div>

          <ImageUpload name="imageUrl" label="Destination Photo" required />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              className="w-5 h-5 rounded border-golden-mid/40 text-golden-dark focus:ring-golden-mid"
            />
            <label htmlFor="featured" className="font-sans text-sm text-charcoal/80">
              Featured Destination
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-golden-gradient text-charcoal py-3 rounded-lg font-sans font-semibold hover:shadow-gold hover:scale-[1.01] transition-all duration-300"
            >
              Create Destination
            </button>
            <a
              href="/admin/destinations"
              className="flex-1 bg-charcoal/10 text-charcoal py-3 rounded-lg font-sans font-medium hover:bg-charcoal/20 transition-all duration-300 text-center"
            >
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
