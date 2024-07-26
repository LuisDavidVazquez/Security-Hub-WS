import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { applyMiddleware } from "./server/middleware";
import { configureSockets } from "./server/sockets";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";

dotenv.config();

const app = express();
app.use(cors());

const optionsHTTPS = {
  key: fs.readFileSync(String(process.env.KEY)),
  cert: fs.readFileSync(String(process.env.CERTIFICATE)),
}

const server = https.createServer(optionsHTTPS, app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

applyMiddleware(app); 
configureSockets(io); 

const port = process.env.SOCKET_SERVER_PORT;  

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
