import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { authenticateSocketMiddleware } from "./middleware";

export const configureSockets = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  io.use(authenticateSocketMiddleware); 

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
