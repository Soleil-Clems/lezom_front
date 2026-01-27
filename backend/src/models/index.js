const { PrismaClient } = require('@prisma/client');
const Message = require('./Message');

const prisma = new PrismaClient();

module.exports = {
  prisma,
  Message,
};
