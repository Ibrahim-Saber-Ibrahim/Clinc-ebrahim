import { Router } from "express";
import { registerUser, getUsers, getUserById } from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
