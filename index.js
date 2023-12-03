const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

// Authentication service proxy
app.use(
  "/auth-service",
  createProxyMiddleware({
    target: "http://localhost:5000/api/v1",
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
    target: "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: {
      "^/core-service": "",
    },
  })
);

//handle not found
app.use((req, res) => {
  res.status(404).json({
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
