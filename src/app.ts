import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { marked } from "marked";
// import { ExpressAuth } from "@auth/express"
// import GitHub from "@auth/express/providers/github"

import userRouter from './routers/user.routes';
import photoRouter from './routers/photo.routes';
import albumRouter from './routers/album.routes';
import healthRouter from './routers/health.routes';
import { errorHandler } from "./middlewares/error.middlewares";
import morgan from "morgan";
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.get("/", (req, res) => {
  const homeTemplatePath = path.join(__dirname, "templates/home.html");
  fs.readFile(homeTemplatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading home template:", err);
      // Fallback if template fails
      return res.json({ message: "Welcome to the SnapStore API" }); 
    }
    res.send(data);
  });
});

app.get("/docs", (req, res) => {
  const docsPath = path.join(__dirname, "../API_DOCUMENTATION.md");
  const templatePath = path.join(__dirname, "templates/docs_template.html");

  fs.readFile(docsPath, "utf8", (docErr, docData) => {
      if (docErr) {
          console.error(docErr);
          return res.status(500).send("Error reading documentation file.");
      }

      fs.readFile(templatePath, "utf8", (tplErr, tplData) => {
          if (tplErr) {
              console.error(tplErr);
              // Fallback to basic HTML if template reads fail
              return res.send(marked(docData)); 
          }

          const htmlContent = marked(docData);
          const finalHtml = tplData.replace("{{CONTENT}}", htmlContent as string);
          res.send(finalHtml);
      });
  });
});

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/photos", photoRouter);
app.use('/api/v1/albums', albumRouter);
app.use("/api/v1/health", healthRouter);

// app.use("/auth/*", ExpressAuth({ providers: [GitHub] }))
app.use(errorHandler);

export { app };