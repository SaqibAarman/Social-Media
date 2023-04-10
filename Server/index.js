import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/uploadRoute.js";
import ChatRoute from "./Routes/ChatRoutes.js";
import MessagesRoute from "./Routes/MessagesRoute.js";
// ROUTES

const app = express();

// TO SERVE IMAGES TO PUBLIC
app.use(express.static("public"));
app.use("/images", express.static("images"));

// MIDDLEWARE
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening At ${process.env.PORT}  `)
    )
  )
  .catch((err) => {
    console.log(err);
  });

// USAGE OF ROUTES
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessagesRoute);
