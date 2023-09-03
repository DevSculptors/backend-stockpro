import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routers/index.routes";
import { connectDB } from "./config/db";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./config/swagger";

const app = express();

dotenv.config();

app.use(
  cors({
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", router());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = http.createServer(app);
// connectDB();

server.listen(process.env.PORT, () => {
  
  console.log(`server running on http://localhost:${process.env.PORT}/`);
});
