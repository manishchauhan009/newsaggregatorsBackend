const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

const defaultOrigins = ["https://putimes.vercel.app", "http://localhost:3000"];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : defaultOrigins;

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    fileupload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
};
