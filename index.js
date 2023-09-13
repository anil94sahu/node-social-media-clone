import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from './Routes/Auth/AuthRoutes.js';
import UserRoute from './Routes/UserRoutes.js';
import PostRoute from './Routes/PostRoutes.js';
import UploadRoute from './Routes/UploadRoute.js';
const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();

mongoose
  .connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`)))
  .catch(error => console.log("Error: " + error));

app.use('/upload',UploadRoute);
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);