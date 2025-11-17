import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};
