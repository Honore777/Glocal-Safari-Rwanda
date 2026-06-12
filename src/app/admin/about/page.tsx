import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateAbout(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!id || !title || !content) {
    throw new Error("Missing required fields");
  }

  const existingAbout = await prisma.about.findFirst();
  
  if (existingAbout) {
    await prisma.about.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
      },
    });
  } else {
    await prisma.about.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
      },
    });
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about");
}

export default async function AboutAdminPage() {
  const about = await prisma.about.findFirst();

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        About Us
      </h1>

      <form action={updateAbout} className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-3xl">
        {about && <input type="hidden" name="id" value={about.id} />}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={about?.title || "About Glocal Rwanda Safaris"}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              defaultValue={about?.content || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all resize-none"
              placeholder="Tell visitors about your company, mission, and values..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              defaultValue={about?.imageUrl || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-safari-green text-white py-3 rounded-lg font-sans font-medium hover:bg-safari-green/90 transition-all duration-300"
          >
            {about ? "Update About Us" : "Create About Us"}
          </button>
        </div>
      </form>
    </div>
  );
}
