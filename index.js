import express from "express";
import authRouter from "./src/routes/authRoutes.js";
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("HELLO, MAFIA PEOPLE!");
});

app.listen(port, () => {
  console.log(`DevBalance server is running on port ${port}`);
});
