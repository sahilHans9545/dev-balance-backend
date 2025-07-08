import { ValidationError } from "yup";
import prisma from "../../config/prisma.js";
import { userSchema } from "../../validation/userSchema.js";
import jwt from "jsonwebtoken";

// TODO : finish the signup controller
export default async (req, res) => {
  // Steps :
  // 1) validate the body ---- done
  // 2) check if the user does not exist (if exist throw the error) ---- done
  // 3) create a jwt token for the user ---- done
  // 4) send a verify link to the user
  // 5) now if the user will open the link and if that url is valid we will add an entry to the users table
  // 6) then will add the token as a cookie to the browser so whenever user will send request to our server jwt token will come

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

    // creating a jwt token to generate a verification link
    const token = jwt.sign(
      { name: userData.name, email: userData.email, password: hashedPassword },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const verifyLink = `${process.env.FRONTEND_DOMAIN}verify-email?token=${token}`;
    console.log("verification LINK : ", verifyLink);

    //TODO : send the above verifyLink to the user mail
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
      console.log("ERROR : ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
