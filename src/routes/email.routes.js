import { Router } from "express";
import {
  sendEmail,
  fetchEmails,
  fetchSampleEmails,
} from "../services/email.service.js";
const router = Router();

router.route("/send").post(sendEmail);
router.route("/get").get(fetchEmails);
router.route("/demo").get(fetchSampleEmails);

export default router;
