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
  res.json({ message: "Welcome to the SnapStore API" });
});

app.get("/docs", (req, res) => {
  const filePath = path.join(__dirname, "../API_DOCUMENTATION.md");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading documentation file.");
    }
    const htmlContent = marked(data);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SnapStore API Documentation</title>
        <style>
          body {
            background-color: #0d1117;
            color: #c9d1d9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #161b22;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            border: 1px solid #30363d;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #58a6ff;
          }
          h1 { border-bottom: 2px solid #21262d; padding-bottom: 0.3em; font-size: 2em; }
          h2 { border-bottom: 2px solid #21262d; padding-bottom: 0.3em; font-size: 1.5em; }
          a { color: #58a6ff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            background-color: rgba(110, 118, 129, 0.4);
            padding: 0.2em 0.4em;
            border-radius: 6px;
            font-size: 85%;
          }
          pre {
            background-color: #0d1117;
            padding: 16px;
            overflow: auto;
            border-radius: 6px;
            border: 1px solid #30363d;
            margin-bottom: 16px;
          }
          pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
          }
          ul, ol { padding-left: 2em; }
          li { margin: 0.25em 0; }
          strong { color: #c9d1d9; font-weight: 600; }
          hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #30363d;
            border: 0;
          }
          blockquote {
            margin: 0;
            padding: 0 1em;
            color: #8b949e;
            border-left: 0.25em solid #30363d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${htmlContent}
        </div>
      </body>
      </html>
    `);
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