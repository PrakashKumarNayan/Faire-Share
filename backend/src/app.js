import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config(); // Ensure this is called before you access `process.env`

const app = express();

// Log the CORS origin for debugging purposes
// console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

// console.log("Cors origin:",process.env.CORS_ORIGIN);
// Configuring CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN , // Fallback in case CORS_ORIGIN is not set
    credentials: true, // Allow cookies and other credentials
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import singleChatsRouter from './routes/singleChats.routes.js'
import groupChats from './routes/groupChat.routes.js'
import conversation from './routes/conversation.route.js'
// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/singleChats",singleChatsRouter);
app.use("/api/v1/groupChats",groupChats)
app.use("/api/v1/conversation",conversation)

export { app };
