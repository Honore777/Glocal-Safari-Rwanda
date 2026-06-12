import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";

async function updateFAQ(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const category = formData.get("category") as string;
  const published = formData.get("published") === "on";

  if (!id || !question || !answer) {
    throw new Error("Missing required fields");
  }

  await prisma.fAQ.update({
    where: { id },
    data: {
      question,
      answer,
      category: category || null,
      published,
    },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({
    where: { id },
  });

  if (!faq) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Edit FAQ
      </h1>

      <form action={updateFAQ} className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl">
        <input type="hidden" name="id" value={faq.id} />
        
        <div className="space-y-6">
          <div>
            <label htmlFor="question" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              id="question"
              name="question"
              required
              defaultValue={faq.question}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="answer" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              id="answer"
              name="answer"
              required
              rows={4}
              defaultValue={faq.answer}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Category (optional)
            </label>
            <input
              type="text"
              id="category"
              name="category"
              defaultValue={faq.category || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={faq.published}
              className="w-5 h-5 rounded border-gray-300 text-safari-green focus:ring-safari-green"
            />
            <label htmlFor="published" className="font-sans text-sm text-gray-700">
              Published
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-safari-green text-white py-3 rounded-lg font-sans font-medium hover:bg-safari-green/90 transition-all duration-300"
            >
              Update FAQ
            </button>
            <a
              href="/admin/faqs"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-sans font-medium hover:bg-gray-300 transition-all duration-300 text-center"
            >
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
