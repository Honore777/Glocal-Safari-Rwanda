import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const revalidate = 3600;

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-widest text-safari-green mb-4">
            Safari Blog
          </h1>
          <p className="font-sans text-xl text-gray-700 max-w-2xl mx-auto">
            Travel stories, Rwanda safari tips, and golden-hour inspiration.
          </p>
        </div>
      </section>

      <section className="py-8 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl overflow-hidden shadow-gold hover:shadow-gold-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-golden-gradient">
                  <Image
                    src={blog.imageUrl || "/images/golden-elephant.jpeg"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <h2 className="font-serif text-2xl text-safari-green mb-2 group-hover:text-golden-dark transition-colors">
                    {blog.title}
                  </h2>
                  <p className="font-sans text-charcoal/70 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-safari-green font-medium group-hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {blogs.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-gray-600">No published blog posts yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
