import connectDb from "./db/dbConnection.js";
import { app } from "./app.js";
import dotenv from "dotenv"
import {createServer} from 'http'
import {Server} from 'socket.io'
dotenv.config()

// const PORT=process.env.PORT || 8000

let prevChats;
let roomName;

connectDb().then( ()=>{

    const server = createServer(app);

    const io = new Server(server,{
        cors:{
            origin: process.env.CORS_ORIGIN || 8000,
            credentials: true
        }
    });

    io.on("connection",(socket)=>{
        console.log("User connected with id:",socket.id)

        //joining a specific room
        socket.on("join group",(groupName)=>{
            socket.join(groupName);
            roomName = groupName;
            // console.log(`${socket.id} joined the group : ${groupName}`)
        })

        //fetching previous chats
        socket.on("previous chats",(chats)=>{
            // console.log("Previous chats:",chats)
            prevChats = chats;
            io.to(roomName).emit("display chats",prevChats);
            // console.log("Previous chats:",prevChats)

        })

        socket.on("new message",(message)=>{
            prevChats.push(message);
            io.to(roomName).emit("display chats",prevChats);
            // console.log("all messages after adding new:",prevChats)
        })

        socket.on("disconnect", () => {
            prevChats = null;
            console.log("User disconnected:", socket.id);
          });
    })



    server.listen(process.env.PORT || 8000 , ()=>{
        console.log("Server is running at PORT",process.env.PORT);
    })
    server.on("error", (error)=>{
        console.log("Failed to start express server",error)
    })
    // app.get("/",(req,res)=>{
    //     res.send("Hello from home page")
    // })
}).catch((error)=>{
    console.log("FAILED MONGO DB CONNECTION",error);
    process.exit(1)
})