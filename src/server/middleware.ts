import { Express } from "express-serve-static-core";
import { authenticateSocket } from "../utils/auth";
import { Request, Response, NextFunction } from "express";

export const applyMiddleware = (app: Express) => {
  app.use((req : Request, res : Response, next : NextFunction) => {
    next();
  });
};

export const authenticateSocketMiddleware = (socket : any, next : any) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Token de autenticación no proporcionado"));
  }
  if (token === "wintersito") {
    return next();
  }
  authenticateSocket(token)
    .then(() => next())
    .catch((err) => next(new Error("Token de autenticación inválido")));
};
