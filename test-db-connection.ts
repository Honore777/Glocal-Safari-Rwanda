import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Query executed successfully:", result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("📊 Current tables:", tables);
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
