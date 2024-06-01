import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";

const router = Router();

router.post('/user/register', registerUser)

export default router;