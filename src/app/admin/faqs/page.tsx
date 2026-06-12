import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit, Trash2, Plus, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

export default async function FAQsAdminPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: "asc" },
  });

  async function deleteFAQ(id: string) {
    "use server";
    await prisma.fAQ.delete({ where: { id } });
  }

  async function togglePublished(id: string, published: boolean) {
    "use server";
    await prisma.fAQ.update({
      where: { id },
      data: { published: !published },
    });
  }

  async function moveUp(id: string, currentOrder: number) {
    "use server";
    const faqAbove = await prisma.fAQ.findFirst({
      where: { order: { lt: currentOrder } },
      orderBy: { order: "desc" },
    });
    
    if (faqAbove) {
      await prisma.$transaction([
        prisma.fAQ.update({ where: { id: faqAbove.id }, data: { order: currentOrder } }),
        prisma.fAQ.update({ where: { id }, data: { order: faqAbove.order } }),
      ]);
    }
  }

  async function moveDown(id: string, currentOrder: number) {
    "use server";
    const faqBelow = await prisma.fAQ.findFirst({
      where: { order: { gt: currentOrder } },
      orderBy: { order: "asc" },
    });
    
    if (faqBelow) {
      await prisma.$transaction([
        prisma.fAQ.update({ where: { id: faqBelow.id }, data: { order: currentOrder } }),
        prisma.fAQ.update({ where: { id }, data: { order: faqBelow.order } }),
      ]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green">
          FAQs
        </h1>
        <Link
          href="/admin/faqs/new"
          className="bg-safari-green text-white px-6 py-3 rounded-lg hover:bg-safari-green/90 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New FAQ
        </Link>
      </div>

      <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-safari-green/10">
            <tr>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Order</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Question</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Category</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Published</th>
              <th className="text-left p-4 font-sans text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className="border-b border-gray-200 hover:bg-white/50 transition-all duration-200">
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <form action={moveUp.bind(null, faq.id, faq.order)}>
                      <button type="submit" className="text-gray-400 hover:text-gray-600">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </form>
                    <form action={moveDown.bind(null, faq.id, faq.order)}>
                      <button type="submit" className="text-gray-400 hover:text-gray-600">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
                <td className="p-4 font-sans font-medium max-w-md truncate">{faq.question}</td>
                <td className="p-4 font-sans text-sm text-gray-600">{faq.category || "-"}</td>
                <td className="p-4">
                  {faq.published ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <form action={togglePublished.bind(null, faq.id, faq.published)}>
                      <button
                        type="submit"
                        className="text-blue-600 hover:text-blue-700"
                        title={faq.published ? "Unpublish" : "Publish"}
                      >
                        {faq.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </form>
                    <Link
                      href={`/admin/faqs/${faq.id}/edit`}
                      className="text-safari-green hover:text-safari-green/80"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <form action={deleteFAQ.bind(null, faq.id)}>
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
            {faqs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No FAQs yet. Add your first FAQ!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
