const { PrismaClient } = require('@prisma/client');
const Message = require('./Message');
const PrivateMessage = require('./PrivateMessage');

const prisma = new PrismaClient();

module.exports = {
  prisma,
  Message,
  PrivateMessage,
};
