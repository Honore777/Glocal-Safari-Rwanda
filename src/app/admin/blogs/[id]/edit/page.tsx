import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

async function updateBlog(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const published = formData.get("published") === "on";

  if (!id || !title || !slug || !excerpt || !content || !imageUrl) {
    throw new Error("Missing required fields");
  }

  await prisma.blog.update({
    where: { id },
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
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blogs");
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Edit Blog
      </h1>

      <form action={updateBlog} className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 max-w-3xl shadow-gold">
        <input type="hidden" name="id" value={blog.id} />
        
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
              defaultValue={blog.title}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
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
              defaultValue={blog.slug}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all"
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
              defaultValue={blog.excerpt}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              defaultValue={blog.content}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all resize-none"
            />
          </div>

          <ImageUpload name="imageUrl" label="Cover Photo" required defaultValue={blog.imageUrl} />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={blog.published}
              className="w-5 h-5 rounded border-golden-mid/40 text-golden-dark focus:ring-golden-mid"
            />
            <label htmlFor="published" className="font-sans text-sm text-charcoal/80">
              Published
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-golden-gradient text-charcoal py-3 rounded-lg font-sans font-semibold hover:shadow-gold hover:scale-[1.01] transition-all duration-300"
            >
              Update Blog
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
