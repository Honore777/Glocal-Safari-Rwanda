const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

export const siteConfig = {
  name: "Glocal Rwanda Safaris",
  title: "Glocal Rwanda Safaris | Rwanda Safari Tours & Gorilla Trekking",
  description:
    "Book premium Rwanda safari experiences, gorilla trekking, wildlife tours, cultural journeys, and custom East African adventures with local experts.",
  url: process.env.SITE_URL || vercelUrl || "http://localhost:3000",
  ogImage: "/images/golden-elephant.jpeg",
  phone: "+250 791 765 545",
  email: "info@glocalrwandasafaris.com",
};
