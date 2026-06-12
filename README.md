# Savannah Sun - Safari & Primate Trekking Platform

A premium, mobile-first Safari and Primate Trekking booking platform built with Next.js 15, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Modern Design System**: Premium editorial aesthetic with warm ivory backgrounds, safari green accents, and golden hour gradients
- **Database-Driven Content**: All safari information stored in PostgreSQL via Prisma ORM
- **Server Actions**: Secure form submissions using Next.js Server Actions
- **ISR Support**: Incremental Static Regeneration for fast updates without redeployment
- **WhatsApp Integration**: Dynamic floating WhatsApp button with route-specific pre-filled messages
- **Inquiry System**: Email notifications via Brevo API with database storage
- **Admin Dashboard**: Real-time inquiry management and content overview

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Brevo API key (for email notifications)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/savannah_db"
BREVO_API_KEY="your_brevo_api_key"
ADMIN_EMAIL="admin@example.com"
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server Actions
│   ├── admin/            # Admin dashboard
│   ├── safaris/          # Safari pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable components
├── lib/                  # Utilities (Prisma client)
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding
```

## Design System

### Colors
- Background: `#F4EFE6` (warm ivory/sand)
- Primary CTA: `#1F382B` (safari green)
- Gradient: Golden hour (`#E0B060` → `#C59445` → `#AA7C32`)

### Typography
- Headings: Cormorant Garamond (serif, uppercase, tracked-wide)
- Body: Inter (geometric sans-serif)

### Components
- Glassmorphism: `backdrop-blur-md bg-white/10 border border-white/20`
- Images: Next.js Image optimization with WebP/AVIF

## Deployment

This application is designed for Vercel deployment with automatic ISR revalidation.

## License

MIT
