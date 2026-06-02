import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllChats, getAllConversations, getAllMembers } from "../controllers/conversation.controller.js";

const router = Router();

router.use(verifyJWT)


router.route("/getAllConversations").get(getAllConversations)

// /api/v1/conversation

router.route("/getAllChats").post(getAllChats)
router.route("/getAllMembers").post(getAllMembers)

export default router
