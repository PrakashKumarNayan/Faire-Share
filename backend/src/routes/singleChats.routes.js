import { Router } from "express";
import { sendExpenseMessage, sendSimpleMessage } from "../controllers/singleChats.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router =Router();

router.route("/sendSimpleMessage").post(verifyJWT,sendSimpleMessage)

router.route("/sendExpenseMessage").post(verifyJWT,sendExpenseMessage)


export default router