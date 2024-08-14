import { Router } from "express";
import { authPrivate } from "../middlewares/Auth.js";
import { getByEmail, info, updateUserName } from "../controllers/UserController.js";


const router = Router();

router.get("/user/me", authPrivate, info);
router.get("/user/:email", getByEmail);
router.post("/user/edit", updateUserName);

export default router;
