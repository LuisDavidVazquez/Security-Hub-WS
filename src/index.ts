import express from "express";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { applyMiddleware } from "./server/middleware";
import { authenticateSocketMiddleware } from "./server/middleware";

dotenv.config();

const app = express();
app.use(cors());

const optionsHTTPS = {
  key: fs.readFileSync(String(process.env.KEY)),
  cert: fs.readFileSync(String(process.env.CERTIFICATE)),
};

const server = https.createServer(optionsHTTPS, app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

applyMiddleware(app);

const configureSockets = (io: Server) => {
  io.use(authenticateSocketMiddleware); 

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("IncomingData", (data) => {
      console.log("Informacion Recibida:", data);
      io.emit("IncomingData", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

configureSockets(io); 

const port = process.env.SOCKET_SERVER_PORT || 5000;  

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
