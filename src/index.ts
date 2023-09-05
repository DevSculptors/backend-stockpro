import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routers/index.routes";

import { authRoutes, personRoutes } from "./routers/route";

import swaggerDocs from "./helpers/Swagger";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`server running on http://localhost:${process.env.PORT}/`);

  authRoutes(app);

  swaggerDocs(app, Number(process.env.PORT));
});
