import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { createProxyMiddleware } from "http-proxy-middleware";
import config from "./config";

const app: Application = express();
const PORT = config.port;

app.use(cors());

//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication service proxy
app.use(
  "/auth-service",
  createProxyMiddleware({
    target: config.auth_service_url,
    changeOrigin: true,
    pathRewrite: {
      "^/auth-service": "",
    },
  })
);

// Core service proxy
app.use(
  "/core-service",
  createProxyMiddleware({
    target: config.core_service_url,
    changeOrigin: true,
    pathRewrite: {
      "^/core-service": "",
    },
  })
);

//handle not found
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
