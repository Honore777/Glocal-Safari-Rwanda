import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";

export default async function BlogsAdminPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function deleteBlog(id: string) {
    "use server";
    await prisma.blog.delete({ where: { id } });
  }

  async function togglePublished(id: string, published: boolean) {
    "use server";
    await prisma.blog.update({
      where: { id },
      data: { published: !published },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green">
          Blogs
        </h1>
        <Link
          href="/admin/blogs/new"
          className="bg-safari-green text-white px-6 py-3 rounded-lg hover:bg-safari-green/90 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Blog
        </Link>
      </div>

      <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-safari-green/10">
            <tr>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Title</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Slug</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Excerpt</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Published</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Created</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b border-gray-200 hover:bg-white/50 transition-all duration-200">
                <td className="p-4 font-sans font-medium">{blog.title}</td>
                <td className="p-4 font-sans text-sm text-gray-600">{blog.slug}</td>
                <td className="p-4 font-sans text-sm text-gray-600 max-w-xs truncate">{blog.excerpt}</td>
                <td className="p-4">
                  {blog.published ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
                <td className="p-4 font-sans text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <form action={togglePublished.bind(null, blog.id, blog.published)}>
                      <button
                        type="submit"
                        className="text-blue-600 hover:text-blue-700"
                        title={blog.published ? "Unpublish" : "Publish"}
                      >
                        {blog.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </form>
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="text-safari-green hover:text-safari-green/80"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteBlog.bind(null, blog.id)}>
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
            {blogs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No blogs yet. Write your first blog post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
