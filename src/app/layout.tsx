import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

const serif = Cormorant_Garamond({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.jpeg`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    sameAs: [
      "https://www.facebook.com/share/1EcjWvE5uT/",
      "https://www.instagram.com/glocal_rwanda_safaris?utm_source=qr&igsh=MXJvbW4zYmtzaTM4Ng==",
      "https://www.linkedin.com/company/glocal-rwanda-safaris/?viewAsMember=true",
      "https://x.com/GlocalRwanda",
    ],
  };

  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
