import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AdminPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const safaris = await prisma.safari.findMany({
    orderBy: { createdAt: "desc" },
  });

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
  });

  async function deleteInquiry(id: string) {
    "use server";
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin");
  }

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="font-sans text-sm text-gray-600 mb-2">Total Inquiries</h2>
          <p className="font-serif text-4xl text-safari-green">{inquiries.length}</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="font-sans text-sm text-gray-600 mb-2">Active Safaris</h2>
          <p className="font-serif text-4xl text-safari-green">{safaris.length}</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="font-sans text-sm text-gray-600 mb-2">Published Blogs</h2>
          <p className="font-serif text-4xl text-safari-green">{blogs.filter((b) => b.published).length}</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="font-sans text-sm text-gray-600 mb-2">Active FAQs</h2>
          <p className="font-serif text-4xl text-safari-green">{faqs.length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/admin/safaris/new"
          className="bg-safari-green text-white rounded-2xl p-6 hover:bg-safari-green/90 transition-all duration-300 hover:shadow-xl"
        >
          <h3 className="font-serif text-xl mb-2">Add New Safari</h3>
          <p className="font-sans text-sm text-white/80">Create a new safari experience</p>
        </Link>
        <Link
          href="/admin/blogs/new"
          className="bg-safari-green text-white rounded-2xl p-6 hover:bg-safari-green/90 transition-all duration-300 hover:shadow-xl"
        >
          <h3 className="font-serif text-xl mb-2">Write Blog Post</h3>
          <p className="font-sans text-sm text-white/80">Share travel stories</p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="bg-safari-green text-white rounded-2xl p-6 hover:bg-safari-green/90 transition-all duration-300 hover:shadow-xl"
        >
          <h3 className="font-serif text-xl mb-2">View Inquiries</h3>
          <p className="font-sans text-sm text-white/80">Manage customer inquiries</p>
        </Link>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-safari-green">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-safari-green hover:underline font-sans text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {inquiries.slice(0, 5).map((inquiry: { id: string; email: string; safariSlug: string; message: string; createdAt: Date }) => (
            <div
              key={inquiry.id}
              className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans font-medium text-gray-900">{inquiry.email}</p>
                  <p className="font-sans text-sm text-gray-600">{inquiry.safariSlug}</p>
                  <p className="font-sans text-sm text-gray-500 mt-1">{inquiry.message}</p>
                  <p className="font-sans text-xs text-gray-400 mt-2">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <form action={deleteInquiry.bind(null, inquiry.id)}>
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-700 font-sans text-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && (
            <p className="font-sans text-gray-500 text-center py-8">No inquiries yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
