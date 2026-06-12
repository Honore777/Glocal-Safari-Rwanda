import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.published) {
    return {
      title: "Blog Post",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `/blog/${slug}`,
      type: "article",
      images: blog.imageUrl ? [blog.imageUrl] : ["/images/golden-elephant.jpeg"],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog || !blog.published) notFound();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.imageUrl,
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "Glocal Rwanda Safaris",
    },
    publisher: {
      "@type": "Organization",
      name: "Glocal Rwanda Safaris",
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <Image
          src={blog.imageUrl || "/images/golden-elephant.jpeg"}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-cream/90 hover:text-sunset-glow mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-cream mb-4 drop-shadow-[0_2px_20px_rgba(255,210,125,0.45)]">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-cream/90">
            <Calendar className="w-5 h-5 text-sunset-glow" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <article className="max-w-4xl mx-auto bg-cream/90 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 md:p-12 shadow-gold">
          <p className="font-sans text-xl text-charcoal/75 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
          <div className="font-sans text-charcoal/85 leading-8 whitespace-pre-line">
            {blog.content}
          </div>
        </article>
      </section>
    </main>
  );
}
