import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function createFAQ(formData: FormData) {
  "use server";
  
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const category = formData.get("category") as string;
  const published = formData.get("published") === "on";

  if (!question || !answer) {
    throw new Error("Missing required fields");
  }

  const maxOrder = await prisma.fAQ.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.fAQ.create({
    data: {
      question,
      answer,
      category: category || null,
      published,
      order: (maxOrder?.order || 0) + 1,
    },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  redirect("/admin/faqs");
}

export default function NewFAQPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Add New FAQ
      </h1>

      <form action={createFAQ} className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl">
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="What is the best time to visit Rwanda?"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all resize-none"
              placeholder="Provide a detailed answer..."
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="General, Booking, Health, etc."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="w-5 h-5 rounded border-gray-300 text-safari-green focus:ring-safari-green"
            />
            <label htmlFor="published" className="font-sans text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-safari-green text-white py-3 rounded-lg font-sans font-medium hover:bg-safari-green/90 transition-all duration-300"
            >
              Create FAQ
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
