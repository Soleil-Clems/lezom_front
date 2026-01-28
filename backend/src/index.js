require("dotenv").config();

const app = require("./app");
const { connectMongoDB, connectPrisma } = require("./config/database");

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectMongoDB();
    await connectPrisma();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
