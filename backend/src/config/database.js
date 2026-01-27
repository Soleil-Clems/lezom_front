const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const connectPrisma = async () => {
  try {
    await prisma.$connect();
    console.log('MySQL (Prisma) connected successfully');
  } catch (error) {
    console.error('Prisma connection error:', error.message);
    process.exit(1);
  }
};

const disconnectAll = async () => {
  await mongoose.disconnect();
  await prisma.$disconnect();
};

module.exports = {
  prisma,
  connectMongoDB,
  connectPrisma,
  disconnectAll,
};
