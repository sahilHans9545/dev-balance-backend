import prisma from "../../config/prisma.js";

// TODO : finish the signup controller
export default async (req, res) => {
  const db = await prisma.$queryRaw`SELECT current_database()`;
  console.log("CURRENT DB : ", db);
  res.json("Signup successfully done.");
};
