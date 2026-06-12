import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import BlogContentEditor from "@/components/BlogContentEditor";

async function createBlog(formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const published = formData.get("published") === "on";

  if (!title || !slug || !excerpt || !content || !imageUrl) {
    throw new Error("Missing required fields");
  }

  await prisma.blog.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl,
      published,
    },
  });

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  redirect("/admin/blogs");
}

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Add New Blog
      </h1>

      <form action={createBlog} className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 max-w-3xl shadow-gold">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
              placeholder="Gorilla Trekking Tips"
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
              placeholder="gorilla-trekking-tips"
            />
            <p className="text-xs text-charcoal/50 mt-1">Use lowercase, hyphens instead of spaces</p>
          </div>

          <div>
            <label htmlFor="excerpt" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Excerpt (Short description)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all resize-none"
              placeholder="A brief summary of the blog post..."
            />
          </div>

          <BlogContentEditor />

          <ImageUpload name="imageUrl" label="Cover Photo" required />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="w-5 h-5 rounded border-golden-mid/40 text-golden-dark focus:ring-golden-mid"
            />
            <label htmlFor="published" className="font-sans text-sm text-charcoal/80">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-golden-gradient text-charcoal py-3 rounded-lg font-sans font-semibold hover:shadow-gold hover:scale-[1.01] transition-all duration-300"
            >
              Create Blog
            </button>
            <a
              href="/admin/blogs"
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
