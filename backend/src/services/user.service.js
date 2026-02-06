const { prisma } = require("../config/database");
const {
  hashPassword,
  comparePassword,
  isEmailTaken,
  isUsernameTaken,
} = require("../utils/user.utils");
const { uploadFile } = require("../utils/storage");
const AppError = require("../utils/AppError");

const userSelect = {
  id: true,
  email: true,
  username: true,
  firstname: true,
  lastname: true,
  img: true,
  description: true,
  role: true,
  isActive: true,
  status: true,
  createdAt: true,
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
};

const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      img: true,
      description: true,
      isActive: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return user;
};

const updateMe = async (userId, data) => {
  const { username, firstname, lastname, email, password, currentPassword, description } = data;

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    throw new AppError(404, "User not found.");
  }

  if (password) {
    const isValidPassword = await comparePassword(
      currentPassword,
      currentUser.password
    );
    if (!isValidPassword) {
      throw new AppError(401, "Current password is incorrect.");
    }
  }

  if (email && (await isEmailTaken(email, userId))) {
    throw new AppError(400, "Email already in use.");
  }
  if (username && (await isUsernameTaken(username, userId))) {
    throw new AppError(400, "Username already in use.");
  }

  const updateData = {};
  if (username) updateData.username = username;
  if (firstname) updateData.firstname = firstname;
  if (lastname) updateData.lastname = lastname;
  if (email) updateData.email = email;
  if (description !== undefined) updateData.description = description;
  if (password) updateData.password = await hashPassword(password);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: userSelect,
  });

  return updatedUser;
};

const deleteMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });
};

const updatePicture = async (userId, file) => {
  if (!file) {
    throw new AppError(400, "No file uploaded.");
  }

  const { url } = await uploadFile(file, "img");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { img: url },
    select: userSelect,
  });

  return updatedUser;
};

module.exports = { getMe, getUser, updateMe, deleteMe, updatePicture };
