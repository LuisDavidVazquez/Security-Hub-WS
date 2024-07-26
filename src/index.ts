import express from "express";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { applyMiddleware } from "./server/middleware";
import { authenticateSocketMiddleware } from "./server/middleware";

// Configuración de variables de entorno
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();
app.use(cors());

// Configuración de opciones HTTPS
const optionsHTTPS = {
  key: fs.readFileSync(String(process.env.KEY)),
  cert: fs.readFileSync(String(process.env.CERTIFICATE)),
};

// Crear el servidor HTTPS
const server = https.createServer(optionsHTTPS, app);

// Configurar Socket.IO con CORS habilitado
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Aplicar middleware a la aplicación Express
applyMiddleware(app);

// Configurar los sockets
const configureSockets = (io: Server) => {
  //io.use(authenticateSocketMiddleware); 

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Manejar eventos de datos esp32
    socket.on("IncomingData", (data) => {
      console.log("Informacion Recibida:", data);
      io.emit("IncomingData", data);
    });

    // Manejar eventos de desconexión
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

// Llamar a la función para configurar los sockets
configureSockets(io); 

// Definir el puerto en el que el servidor escuchará las conexiones
const port = process.env.SOCKET_SERVER_PORT || 5000;  

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
