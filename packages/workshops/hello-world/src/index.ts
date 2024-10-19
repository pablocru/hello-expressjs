import { PORT } from "@hello-expressjs/environment-config";
import { serverLifecycleHandler } from "@hello-expressjs/server-lifecycle-handler";
import express from "express";

const app = express();

app.get("/", (_request, response) => {
  response.send("Hello, Express.js + TypeScript!");
});

serverLifecycleHandler(app, PORT);
