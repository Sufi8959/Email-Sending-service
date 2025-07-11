import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const sendEmailViaMockProviderTwo = asyncHandler(
  async ({ to, subject, body }) => {
    console.log(`[MockProvider1] Attempting to send email to ${to}`);
    const success = true; // 70% success rate

    await new Promise((res) => setTimeout(res, 300));

    if (success) {
      console.log(`MockProvider two email sent successfully.`);
      return { success: true };
    } else {
      console.log(`MockProvider two failed to send email.`);
      throw new ApiError(400, "Provider two failed");
    }
  }
);

export { sendEmailViaMockProviderTwo };
