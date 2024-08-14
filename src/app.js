import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}))
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
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/photos", photoRouter)
app.use('/api/v1/albums', albumRouter)

export { app }