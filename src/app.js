import express from "express";
const app = express();
import emailRouter from "./services/email.service.js";

app.use(express.json());
app.use("/api/v1/email", emailRouter);

export { app };
