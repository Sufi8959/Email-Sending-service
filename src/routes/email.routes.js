import { Router } from "express";
import sendEmail from "../services/email.service.js";
const router = Router();

router.route("/send").post(sendEmail);
