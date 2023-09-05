import express, {Express} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import router from "./routers/index.routes";

import authRoutes from "./routers/route";
import personRoutes from "./routers/pers.routes";

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

//Puede mandarla al index de routers
function routes(app: Express): void {
  authRoutes(app);
  personRoutes(app);

}

app.listen(process.env.PORT, () => {

  console.log(`server running on http://localhost:${process.env.PORT}/`);

  routes(app);

  swaggerDocs(app, Number(process.env.PORT));
});
