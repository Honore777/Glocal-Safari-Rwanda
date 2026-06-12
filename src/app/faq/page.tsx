import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-widest text-safari-green mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-xl text-gray-700">
            Helpful answers before your Rwanda safari adventure.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-cream/90 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-6 shadow-gold">
              {faq.category && (
                <p className="font-sans text-sm uppercase tracking-widest text-golden-dark mb-2">
                  {faq.category}
                </p>
              )}
              <h2 className="font-serif text-2xl text-safari-green mb-3">
                {faq.question}
              </h2>
              <p className="font-sans text-charcoal/75 leading-7">
                {faq.answer}
              </p>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-center font-sans text-gray-600">No FAQs published yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
