import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { database } from "./utils/db.js";
import router from "./routes/route.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
origin:process.env.CORS_ORIGIN,
}))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.urlencoded({ extended: true }))

// app.use(express.json({limit : "16kb"}));
// app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/v1", router);

app.listen(process.env.PORT, () => {
  database();
  console.log("Server listening on port", process.env.PORT);
});
