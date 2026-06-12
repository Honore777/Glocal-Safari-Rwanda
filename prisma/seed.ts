import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminEmail = "admin@glocalrwanda.com";
  const adminPassword = "admin123";
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }
  // Create sample safaris
  const gorillaTrekking = await prisma.safari.create({
    data: {
      slug: "mountain-gorilla-trekking",
      title: "Mountain Gorilla Trekking",
      description: "Encounter majestic mountain gorillas in their natural habitat. This once-in-a-lifetime experience takes you deep into the Bwindi Impenetrable Forest for an intimate encounter with these endangered primates.",
      duration: 4,
      price: 2500,
      imageUrl: "/images/gorilla-trekking.jpg",
      featured: true,
      itineraries: {
        create: [
          {
            day: 1,
            title: "Arrival in Entebbe",
            content: "Transfer from Entebbe International Airport to your hotel. Brief orientation about the trekking experience.",
          },
          {
            day: 2,
            title: "Transfer to Bwindi",
            content: "Scenic drive through southwestern Uganda to Bwindi Impenetrable Forest. Check into your lodge.",
          },
          {
            day: 3,
            title: "Gorilla Trekking Day",
            content: "Early morning briefing before trekking into the forest. Spend one hour with the gorillas. Return to lodge for relaxation.",
          },
          {
            day: 4,
            title: "Return to Entebbe",
            content: "Morning drive back to Entebbe. Optional city tour before departure.",
          },
        ],
      },
    },
  });

  const serengetiSafari = await prisma.safari.create({
    data: {
      slug: "serengeti-migration",
      title: "Serengeti Migration Safari",
      description: "Witness the great migration across the vast Serengeti plains. Follow millions of wildebeest and zebras on their annual journey in this spectacular wildlife spectacle.",
      duration: 7,
      price: 4200,
      imageUrl: "/images/serengeti.jpg",
      featured: true,
      itineraries: {
        create: [
          {
            day: 1,
            title: "Arrival in Arusha",
            content: "Transfer from Kilimanjaro Airport to Arusha. Rest and prepare for the adventure ahead.",
          },
          {
            day: 2,
            title: "Tarangire National Park",
            content: "Game drive in Tarangire, famous for its large elephant herds and baobab trees.",
          },
          {
            day: 3,
            title: "Lake Manyara",
            content: "Visit Lake Manyara National Park, known for tree-climbing lions and diverse birdlife.",
          },
          {
            day: 4,
            title: "Enter Serengeti",
            content: "Drive to Serengeti National Park. Afternoon game drive en route to lodge.",
          },
          {
            day: 5,
            title: "Full Day Serengeti",
            content: "Full day game drive following the migration herds. Picnic lunch in the bush.",
          },
          {
            day: 6,
            title: "Ngorongoro Crater",
            content: "Morning drive to Ngorongoro Crater. Descend into the crater for incredible wildlife viewing.",
          },
          {
            day: 7,
            title: "Departure",
            content: "Final game drive before returning to Arusha for departure.",
          },
        ],
      },
    },
  });

  const goldenMonkey = await prisma.safari.create({
    data: {
      slug: "golden-monkey-trekking",
      title: "Golden Monkey Trekking",
      description: "Track rare golden monkeys in Volcanoes National Park. These playful primates offer a unique and delightful wildlife photography opportunity.",
      duration: 5,
      price: 1800,
      imageUrl: "/images/golden-monkey.jpg",
      featured: false,
      itineraries: {
        create: [
          {
            day: 1,
            title: "Arrival in Kigali",
            content: "Transfer from Kigali Airport. City tour including genocide memorial.",
          },
          {
            day: 2,
            title: "Transfer to Volcanoes",
            content: "Drive to Volcanoes National Park. Check into eco-lodge near the park.",
          },
          {
            day: 3,
            title: "Golden Monkey Trekking",
            content: "Morning trek to find golden monkey troops. Spend time observing and photographing them.",
          },
          {
            day: 4,
            title: "Cultural Experience",
            content: "Visit local communities and learn about Rwandan culture and traditions.",
          },
          {
            day: 5,
            title: "Departure",
            content: "Return to Kigali for international departure.",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
