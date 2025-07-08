import { ValidationError } from "yup";
import prisma from "../../config/prisma.js";
import { userSchema } from "../../validation/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../../helpers/sendMail.js";

/**
 * @function signup
 * @description Handles user signup by validating data, checking for existing users, hashing password,
 *              generating a verification token, and sending a verification email.
 *
 * @path : /api/auth/signup
 * @example
 * Resquest body Example :
 * req.body = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securepassword123"
 * }
 *
 */
export default async (req, res) => {
  try {
    const userData = req.body;
    // validating the user Object
    await userSchema.validate(userData);

    // checking if user is already present with the given email
    const user = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // hashing the user password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // creating a jwt token to generate a verification link
    const token = jwt.sign(
      { name: userData.name, email: userData.email, password: hashedPassword },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const verifyLink = `${process.env.FRONTEND_DOMAIN}verify-email?token=${token}`;

    // TODO : Improve the html body.
    await sendMail(
      userData.email,
      "Verify Your Email",
      `<h3>Click below to verify your email:</h3>
             <a href="${verifyLink}">Verify Email</a>`
    );
    res.status(200).json({
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    } else {
      console.log("Error while signing up : ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
