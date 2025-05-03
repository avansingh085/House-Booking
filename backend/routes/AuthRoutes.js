import express from "express";
const router = express.Router();
import  AuthController from "../controllers/AuthController.js";
import verifyToken  from "../middleware/authMiddleware.js";

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});
export default router;