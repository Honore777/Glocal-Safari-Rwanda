"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSafari(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const duration = parseInt(formData.get("duration") as string);
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "on";

  if (!title) throw new Error("Title is required");
  if (!slug) throw new Error("Slug is required");
  if (!description) throw new Error("Description is required");
  if (!duration || Number.isNaN(duration)) throw new Error("Duration is required");
  if (Number.isNaN(price)) throw new Error("Price is required");
  if (!imageUrl) throw new Error("Please upload a main safari photo before saving");

  // Build itineraries array from form data
  const itineraries = [];
  for (let day = 1; day <= duration; day++) {
    const dayTitle = formData.get(`day${day}_title`) as string;
    const dayContent = formData.get(`day${day}_content`) as string;
    const dayImageUrl = formData.get(`day${day}_imageUrl`) as string;

    if (dayTitle && dayContent) {
      itineraries.push({
        day,
        title: dayTitle,
        content: dayContent,
        imageUrl: dayImageUrl || null,
      });
    }
  }

  await prisma.safari.create({
    data: {
      title,
      slug,
      description,
      duration,
      price,
      imageUrl,
      featured,
      itineraries: {
        create: itineraries,
      },
    },
  });

  revalidatePath("/admin/safaris");
  revalidatePath("/safaris");
  redirect("/admin/safaris");
}

export async function updateSafari(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const duration = parseInt(formData.get("duration") as string);
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "on";

  if (!id) throw new Error("Safari id is missing");
  if (!title) throw new Error("Title is required");
  if (!slug) throw new Error("Slug is required");
  if (!description) throw new Error("Description is required");
  if (!duration || Number.isNaN(duration)) throw new Error("Duration is required");
  if (Number.isNaN(price)) throw new Error("Price is required");
  if (!imageUrl) throw new Error("Please upload a main safari photo before saving");

  // Build itineraries array from form data
  const itineraries = [];
  for (let day = 1; day <= duration; day++) {
    const dayTitle = formData.get(`day${day}_title`) as string;
    const dayContent = formData.get(`day${day}_content`) as string;
    const dayImageUrl = formData.get(`day${day}_imageUrl`) as string;

    if (dayTitle && dayContent) {
      itineraries.push({
        day,
        title: dayTitle,
        content: dayContent,
        imageUrl: dayImageUrl || null,
      });
    }
  }

  // Update safari and replace all itineraries
  await prisma.$transaction([
    // Delete existing itineraries
    prisma.itinerary.deleteMany({
      where: { safariId: id },
    }),
    // Update safari
    prisma.safari.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        duration,
        price,
        imageUrl,
        featured,
        itineraries: {
          create: itineraries,
        },
      },
    }),
  ]);

  revalidatePath("/admin/safaris");
  revalidatePath("/safaris");
  revalidatePath(`/safaris/${slug}`);
  redirect("/admin/safaris");
}
