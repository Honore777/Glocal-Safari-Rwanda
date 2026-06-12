import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Trash2, Mail, Phone, Users } from "lucide-react";

export default async function InquiriesAdminPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  async function deleteInquiry(id: string) {
    "use server";
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
  }

  return (
    <div>
      <h1 className="font-serif text-4xl uppercase tracking-widest text-safari-green mb-8">
        Inquiries
      </h1>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-gold">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-safari-green">
                  {inquiry.firstName} {inquiry.lastName}
                </h2>
                <p className="font-sans text-sm text-gray-500 mt-1">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <form action={deleteInquiry.bind(null, inquiry.id)}>
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-700"
                  title="Delete inquiry"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2 font-sans text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                {inquiry.email}
              </div>
              <div className="flex items-center gap-2 font-sans text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                {inquiry.phone}
              </div>
              <div className="flex items-center gap-2 font-sans text-sm text-gray-700">
                <Users className="w-4 h-4 text-gray-400" />
                {inquiry.groupSize} travelers
              </div>
              <div className="font-sans text-sm text-gray-700">
                <span className="font-semibold">Safari:</span> {inquiry.safariSlug}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-cream p-4">
              <p className="font-sans text-sm text-gray-600 whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center text-gray-500">
            No inquiries yet.
          </div>
        )}
      </div>
    </div>
  );
}
