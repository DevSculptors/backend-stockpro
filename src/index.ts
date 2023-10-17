import express, {Express} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routers/index.routes";

import swaggerDocs from "./helpers/Swagger";

const app = express();

dotenv.config();

const allowedOrigins = [process.env.FRONTEND_DEPLOY_URL, process.env.FRONTEND_URL];

console.log(allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



app.use(morgan("dev"));
app.use(compression());
app.use(cookieParser());
// app.use("/api", router(app));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {

  console.log(`server running on http://localhost:${process.env.PORT}/`);

  router(app);
  swaggerDocs(app, Number(process.env.PORT));
});
