const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim()) // Trim spaces
  : [];

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    fileupload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error(`Blocked by CORS: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // Ensure preflight requests are handled
  app.options("*", cors());
};
