import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

/**
 * Controller for verifying email using token from query param.
 * - If token is valid and user doesn't exist → create user.
 */
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  try {
    // Decode token to get payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !decoded.email ||
      !decoded.name ||
      !decoded.password
    ) {
      return res.status(400).json({ message: "Invalid token payload." });
    }

    const { name, email, password } = decoded;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Invalid or expired token." });
  }
};

export default verifyEmail;
