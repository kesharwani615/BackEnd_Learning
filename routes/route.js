import { Router } from "express";
import { loginUser, registerUser, updateProfile } from "../controller/user.controller.js";
import { send_Mail } from "../controller/nodemailer.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post(
  "/user/register",
  upload.fields([
    { 
        name: "avatar",
        maxCount:1 
    }
    ]),
  registerUser
);

router.post('/user/login',loginUser)

router.post("/mail/send",send_Mail);

export default router;
