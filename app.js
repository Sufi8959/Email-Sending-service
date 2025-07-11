import express from "express";
const app = express();
import emailRouter from "./src/routes/email.routes.js";

app.use(express.json());
app.use("/api/v1/email", emailRouter);
export { app };
