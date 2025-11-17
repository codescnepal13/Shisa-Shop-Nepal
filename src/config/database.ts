import mongoose from "mongoose";

export const connectToDatabase = async (uri: string) => {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
