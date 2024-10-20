import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/express/providers/github"
import { createServer } from "http";
import { Server } from "socket.io";
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}))

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routers/user.routs.js'
import photoRouter from './routers/photo.routes.js'
import albumRouter from './routers/album.routes.js'
import { errorHandler } from "./middlewares/error.middlewares.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/photos", photoRouter)
app.use('/api/v1/albums', albumRouter)


// app.use("/auth/*", ExpressAuth({ providers: [GitHub] }))
app.use(errorHandler)
export { app }