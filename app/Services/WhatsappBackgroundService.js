"use strict";

const WhatsappService = require("./WhatsappService");

class WhatsappBackgroundService {
  /**
   * Send registration message in background
   * @param {string} kodePendaftaran
   */
  async sendRegisterMessageBackground(kodePendaftaran) {
    return new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(
            `Background: Starting to send registration message for ${kodePendaftaran}`
          );
          const result = await WhatsappService.sendRegisterMessage(
            kodePendaftaran
          );
          console.log(
            `Background: Registration message sent successfully for ${kodePendaftaran}`
          );
          resolve({ success: true, result });
        } catch (error) {
          console.error(
            `Background: Failed to send registration message for ${kodePendaftaran}:`,
            error.message
          );
          resolve({ success: false, error: error.message });
        }
      });
    });
  }

  /**
   * Send approval message in background
   * @param {string} kodePendaftaran
   */
  async sendApprovalMessageBackground(kodePendaftaran) {
    return new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(
            `Background: Starting to send approval message for ${kodePendaftaran}`
          );
          const result = await WhatsappService.sendApprovalMessage(
            kodePendaftaran
          );
          console.log(
            `Background: Approval message sent successfully for ${kodePendaftaran}`
          );
          resolve({ success: true, result });
        } catch (error) {
          console.error(
            `Background: Failed to send approval message for ${kodePendaftaran}:`,
            error.message
          );
          resolve({ success: false, error: error.message });
        }
      });
    });
  }

  /**
   * Send rejection message in background
   * @param {string} kodePendaftaran
   */
  async sendRejectedMessageBackground(kodePendaftaran) {
    return new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(
            `Background: Starting to send rejection message for ${kodePendaftaran}`
          );
          const result = await WhatsappService.sendRejectedMessage(
            kodePendaftaran
          );
          console.log(
            `Background: Rejection message sent successfully for ${kodePendaftaran}`
          );
          resolve({ success: true, result });
        } catch (error) {
          console.error(
            `Background: Failed to send rejection message for ${kodePendaftaran}:`,
            error.message
          );
          resolve({ success: false, error: error.message });
        }
      });
    });
  }

  /**
   * Send bill to user in background
   * @param {string} kodePendaftaran
   */
  async sendBillToUserBackground(kodePendaftaran) {
    return new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(
            `Background: Starting to send bill to user for ${kodePendaftaran}`
          );
          const result = await WhatsappService.sendBillToUser(kodePendaftaran);
          console.log(
            `Background: Bill sent to user successfully for ${kodePendaftaran}`
          );
          resolve({ success: true, result });
        } catch (error) {
          console.error(
            `Background: Failed to send bill to user for ${kodePendaftaran}:`,
            error.message
          );
          resolve({ success: false, error: error.message });
        }
      });
    });
  }

  /**
   * Send bill to keuangan in background
   * @param {string} kodePendaftaran
   */
  async sendBillToKeuanganBackground(kodePendaftaran) {
    return new Promise((resolve) => {
      setImmediate(async () => {
        try {
          console.log(
            `Background: Starting to send bill to keuangan for ${kodePendaftaran}`
          );
          const result = await WhatsappService.sendBillToKeuangan(
            kodePendaftaran
          );
          console.log(
            `Background: Bill sent to keuangan successfully for ${kodePendaftaran}`
          );
          resolve({ success: true, result });
        } catch (error) {
          console.error(
            `Background: Failed to send bill to keuangan for ${kodePendaftaran}:`,
            error.message
          );
          resolve({ success: false, error: error.message });
        }
      });
    });
  }

  /**
   * Fire and forget - doesn't wait for completion
   * @param {string} method - Method name to call on WhatsappService
   * @param {string} kodePendaftaran
   */
  fireAndForget(method, kodePendaftaran) {
    setImmediate(async () => {
      try {
        console.log(
          `Background (Fire & Forget): Starting ${method} for ${kodePendaftaran}`
        );
        await WhatsappService[method](kodePendaftaran);
        console.log(
          `Background (Fire & Forget): ${method} completed for ${kodePendaftaran}`
        );
      } catch (error) {
        console.error(
          `Background (Fire & Forget): ${method} failed for ${kodePendaftaran}:`,
          error.message
        );
      }
    });
  }

  /**
   * Fire and forget with delay
   * @param {string} method
   * @param {string} kodePendaftaran
   * @param {number} delayMs - Delay in milliseconds
   */
  fireAndForgetWithDelay(method, kodePendaftaran, delayMs = 1000) {
    setTimeout(async () => {
      try {
        console.log(
          `Background (Delayed): Starting ${method} for ${kodePendaftaran} after ${delayMs}ms`
        );
        await WhatsappService[method](kodePendaftaran);
        console.log(
          `Background (Delayed): ${method} completed for ${kodePendaftaran}`
        );
      } catch (error) {
        console.error(
          `Background (Delayed): ${method} failed for ${kodePendaftaran}:`,
          error.message
        );
      }
    }, delayMs);
  }

  /**
   * Batch processing with delay between each job
   * @param {Array} jobs - Array of {method, kodePendaftaran} objects
   * @param {number} delay - Delay between jobs in milliseconds
   */
  async processBatch(jobs, delay = 1000) {
    console.log(`Background: Starting batch processing of ${jobs.length} jobs`);

    for (let i = 0; i < jobs.length; i++) {
      const { method, kodePendaftaran } = jobs[i];

      setImmediate(async () => {
        try {
          console.log(
            `Background Batch: Processing job ${i + 1}/${
              jobs.length
            } - ${method} for ${kodePendaftaran}`
          );
          await WhatsappService[method](kodePendaftaran);
          console.log(`Background Batch: Job ${i + 1} completed`);
        } catch (error) {
          console.error(
            `Background Batch: Job ${i + 1} failed:`,
            error.message
          );
        }
      });

      // Add delay between jobs to avoid overwhelming the WhatsApp API
      if (i < jobs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Send multiple messages with retry logic
   * @param {string} method
   * @param {string} kodePendaftaran
   * @param {number} maxRetries
   */
  fireAndForgetWithRetry(method, kodePendaftaran, maxRetries = 3) {
    const attemptSend = async (attempt) => {
      try {
        console.log(
          `Background (Retry): Attempt ${attempt}/${maxRetries} - ${method} for ${kodePendaftaran}`
        );
        await WhatsappService[method](kodePendaftaran);
        console.log(
          `Background (Retry): ${method} completed for ${kodePendaftaran} on attempt ${attempt}`
        );
      } catch (error) {
        console.error(
          `Background (Retry): Attempt ${attempt} failed for ${kodePendaftaran}:`,
          error.message
        );

        if (attempt < maxRetries) {
          const retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Background (Retry): Retrying in ${retryDelay}ms...`);
          setTimeout(() => attemptSend(attempt + 1), retryDelay);
        } else {
          console.error(
            `Background (Retry): All ${maxRetries} attempts failed for ${kodePendaftaran}`
          );
        }
      }
    };

    setImmediate(() => attemptSend(1));
  }
}

module.exports = new WhatsappBackgroundService();
