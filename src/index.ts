import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { applyMiddleware } from "./server/middleware";
import { configureSockets } from "./server/sockets";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

applyMiddleware(app); // Configurar middleware
configureSockets(io); // Configurar sockets

const port = process.env.SOCKET_SERVER_PORT;  

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
