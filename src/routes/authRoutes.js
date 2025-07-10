import signup from "../controllers/auth/signup.js";
import { Router } from "express";
import verifyEmail from "../controllers/auth/verifyEmail.js";
const router = Router();

router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

export default router;
