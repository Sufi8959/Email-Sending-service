import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import { sampleEmails } from "../dummy_data/sampleEmail.js";
import {
  isSent,
  markSent,
  updateStatus,
  getStatus,
} from "../store/inMemory.js";
import { v4 as uuidv4 } from "uuid";
import { sendEmailViaMockProviderOne } from "../providers/mockProviderOne.js";
import { sendEmailViaMockProviderTwo } from "../providers/mockProviderTwo.js";
const max_retries = 3;
let rate_limit = 5;
let sent_count = 0;

setInterval(() => {
  sent_count = 0;
}, 60 * 1000);

const trySendWithRetries = async (sendFunction, providerName, email) => {
  for (let attempt = 1; attempt <= max_retries; attempt++) {
    try {
      await sendFunction(email);
      return;
    } catch (err) {
      logger.warn(`Attempt ${attempt} failed on ${providerName}. Retrying...`);
      await new Promise((res) => setTimeout(res, 1000 * 2 ** attempt));
    }
  }
  throw new Error(`${providerName} failed after ${max_retries} retries.`);
};

const sendEmail = asyncHandler(async (req, res) => {
  const { to, subject, body } = req.body;
  const id = uuidv4();
  if (
    ![to, subject, body].every(
      (field) => typeof field === "string" && field.trim !== ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (isSent(id)) {
    return res.status(200).json(new ApiResponse(200, "Email already sent"));
  }

  if (sent_count >= rate_limit) {
    updateStatus(id, "rate-limited");
    throw new ApiError(429, "Rate limit exceeded. Try again later.");
  }

  sent_count++;
  updateStatus(id, "sending");

  try {
    await trySendWithRetries(sendEmailViaMockProviderOne, "MockProviderOne", {
      to,
      subject,
      body,
    });
    markSent(id);
    updateStatus(id, "sent");
  } catch (error) {
    logger.warn("Primary provider failed. Switching to fallback");

    try {
      await trySendWithRetries(sendEmailViaMockProviderTwo, "MockProviderTwo", {
        to,
        subject,
        body,
      });
      markSent(id);
      updateStatus(id, "sent");
    } catch (error) {
      updateStatus(id, "failed");
      throw new ApiError(500, "All providers failed to send the email");
    }
  }

  return res.status(200).json(new ApiResponse(200, "email sent successfully"));
});
const fetchEmails = asyncHandler(async (req, res) => {
  const statuses = getStatus();
  return res
    .status(200)
    .json(new ApiResponse(200, statuses, "Fetched all email statuses"));
});

const fetchSampleEmails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, sampleEmails, "Sample demo emails for testing"));
});

export { sendEmail, fetchEmails, fetchSampleEmails };
