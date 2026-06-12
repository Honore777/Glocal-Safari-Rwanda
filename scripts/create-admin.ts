import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@glocalrwanda.com";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });

  console.log(`Admin created: ${email}`);
  console.log(`Password: ${password}`);
  console.log("IMPORTANT: Change this password immediately after first login.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
