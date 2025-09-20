"use strict";

const WhatsappService = require("./WhatsappService");
const WhatsappLog = use("App/Models/WhatsappLog");
const Database = use('Database');

class WhatsappBackgroundService {
  /**
   * Fire and forget with database logging
   * @param {string} method - Method name to call on WhatsappService
   * @param {string} kodePendaftaran
   */
  fireAndForget(method, kodePendaftaran) {
    setImmediate(async () => {
      const startTime = Date.now();
      let log = null;

      try {
        // Create initial log entry
        log = await WhatsappLog.logStart(kodePendaftaran, method);

        console.log(
          `Background (Fire & Forget): Starting ${method} for ${kodePendaftaran} [Log ID: ${log.id}]`
        );

        // Execute WhatsApp service method
        const result = await WhatsappService[method](kodePendaftaran);
        const processingTime = Date.now() - startTime;

        // Log success
        await log.logSuccess(result, processingTime);

        console.log(
          `Background (Fire & Forget): ${method} completed for ${kodePendaftaran} [Log ID: ${log.id}] in ${processingTime}ms`
        );
      } catch (error) {
        console.error(
          `Background (Fire & Forget): ${method} failed for ${kodePendaftaran} [Log ID: ${
            log?.id || "N/A"
          }]:`,
          error.message
        );

        // Log error
        if (log) {
          await log.logError(error);
        }
      }
    });
  }

  /**
   * Fire and forget with retry and database logging
   * @param {string} method
   * @param {string} kodePendaftaran
   * @param {number} maxRetries
   */
  fireAndForgetWithRetry(method, kodePendaftaran, maxRetries = 3) {
    setImmediate(async () => {
      let log = null;

      try {
        // Create initial log entry
        log = await WhatsappLog.logStart(kodePendaftaran, method, maxRetries);
      } catch (error) {
        console.error("Failed to create log entry:", error.message);
      }

      const attemptSend = async (attempt) => {
        const startTime = Date.now();

        try {
          console.log(
            `Background (Retry): Attempt ${attempt}/${maxRetries} - ${method} for ${kodePendaftaran} [Log ID: ${
              log?.id || "N/A"
            }]`
          );

          // Execute WhatsApp service method
          const result = await WhatsappService[method](kodePendaftaran);
          const processingTime = Date.now() - startTime;

          // Log success
          if (log) {
            await log.logSuccess(result, processingTime);
          }

          console.log(
            `Background (Retry): ${method} completed for ${kodePendaftaran} on attempt ${attempt} [Log ID: ${
              log?.id || "N/A"
            }] in ${processingTime}ms`
          );
        } catch (error) {
          console.error(
            `Background (Retry): Attempt ${attempt} failed for ${kodePendaftaran} [Log ID: ${
              log?.id || "N/A"
            }]:`,
            error.message
          );

          // Log error/retry
          if (log) {
            await log.logError(error, attempt);
          }

          if (attempt < maxRetries) {
            const retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(
              `Background (Retry): Retrying in ${retryDelay}ms... [Log ID: ${
                log?.id || "N/A"
              }]`
            );

            // Log retry attempt
            if (log) {
              await log.logRetry(attempt + 1);
            }

            setTimeout(() => attemptSend(attempt + 1), retryDelay);
          } else {
            console.error(
              `Background (Retry): All ${maxRetries} attempts failed for ${kodePendaftaran} [Log ID: ${
                log?.id || "N/A"
              }]`
            );
          }
        }
      };

      attemptSend(1);
    });
  }

  /**
   * Fire and forget with retry using existing log entry
   * @param {string} method
   * @param {string} kodePendaftaran
   * @param {number} maxRetries
   * @param {number} existingLogId - ID of existing log to update
   */
  fireAndForgetWithRetryExistingLog(method, kodePendaftaran, maxRetries = 3, existingLogId = null) {
    setImmediate(async () => {
      let log = null;

      try {
        if (existingLogId) {
          // Get existing log
          log = await WhatsappLog.find(existingLogId);
          if (!log) {
            console.error(`Log with ID ${existingLogId} not found, creating new log`);
            log = await WhatsappLog.logStart(kodePendaftaran, method, maxRetries);
          }
        } else {
          // Create new log if no existing log ID provided
          log = await WhatsappLog.logStart(kodePendaftaran, method, maxRetries);
        }
      } catch (error) {
        console.error("Failed to get/create log entry:", error.message);
      }

      const attemptSend = async (attempt) => {
        const startTime = Date.now();

        try {
          console.log(
            `Background (Resend): Attempt ${attempt}/${maxRetries} - ${method} for ${kodePendaftaran} [Log ID: ${
              log?.id || "N/A"
            }]`
          );

          // Execute WhatsApp service method
          const result = await WhatsappService[method](kodePendaftaran);
          const processingTime = Date.now() - startTime;

          // Log success
          if (log) {
            await log.logSuccess(result, processingTime);
          }

          console.log(
            `Background (Resend): ${method} completed for ${kodePendaftaran} on attempt ${attempt} [Log ID: ${
              log?.id || "N/A"
            }] in ${processingTime}ms`
          );
        } catch (error) {
          console.error(
            `Background (Resend): Attempt ${attempt} failed for ${kodePendaftaran} [Log ID: ${
              log?.id || "N/A"
            }]:`,
            error.message
          );

          // Log error/retry
          if (log) {
            await log.logError(error, attempt);
          }

          if (attempt < maxRetries) {
            const retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(
              `Background (Resend): Retrying in ${retryDelay}ms... [Log ID: ${
                log?.id || "N/A"
              }]`
            );

            // Log retry attempt
            if (log) {
              await log.logRetry(attempt + 1);
            }

            setTimeout(() => attemptSend(attempt + 1), retryDelay);
          } else {
            console.error(
              `Background (Resend): All ${maxRetries} attempts failed for ${kodePendaftaran} [Log ID: ${
                log?.id || "N/A"
              }]`
            );
          }
        }
      };

      attemptSend(1);
    });
  }

  /**
   * Fire and forget with delay and database logging
   * @param {string} method
   * @param {string} kodePendaftaran
   * @param {number} delayMs - Delay in milliseconds
   */
  fireAndForgetWithDelay(method, kodePendaftaran, delayMs = 1000) {
    setTimeout(async () => {
      const startTime = Date.now();
      let log = null;

      try {
        // Create initial log entry
        log = await WhatsappLog.logStart(kodePendaftaran, method);

        console.log(
          `Background (Delayed): Starting ${method} for ${kodePendaftaran} after ${delayMs}ms [Log ID: ${log.id}]`
        );

        // Execute WhatsApp service method
        const result = await WhatsappService[method](kodePendaftaran);
        const processingTime = Date.now() - startTime;

        // Log success
        await log.logSuccess(result, processingTime);

        console.log(
          `Background (Delayed): ${method} completed for ${kodePendaftaran} [Log ID: ${log.id}] in ${processingTime}ms`
        );
      } catch (error) {
        console.error(
          `Background (Delayed): ${method} failed for ${kodePendaftaran} [Log ID: ${
            log?.id || "N/A"
          }]:`,
          error.message
        );

        // Log error
        if (log) {
          await log.logError(error);
        }
      }
    }, delayMs);
  }

  /**
   * Batch processing with database logging
   * @param {Array} jobs - Array of {method, kodePendaftaran} objects
   * @param {number} delay - Delay between jobs in milliseconds
   */
  async processBatch(jobs, delay = 1000) {
    console.log(`Background: Starting batch processing of ${jobs.length} jobs`);

    for (let i = 0; i < jobs.length; i++) {
      const { method, kodePendaftaran } = jobs[i];

      setImmediate(async () => {
        const startTime = Date.now();
        let log = null;

        try {
          // Create initial log entry
          log = await WhatsappLog.logStart(kodePendaftaran, method);

          console.log(
            `Background Batch: Processing job ${i + 1}/${
              jobs.length
            } - ${method} for ${kodePendaftaran} [Log ID: ${log.id}]`
          );

          // Execute WhatsApp service method
          const result = await WhatsappService[method](kodePendaftaran);
          const processingTime = Date.now() - startTime;

          // Log success
          await log.logSuccess(result, processingTime);

          console.log(
            `Background Batch: Job ${i + 1} completed [Log ID: ${
              log.id
            }] in ${processingTime}ms`
          );
        } catch (error) {
          console.error(
            `Background Batch: Job ${i + 1} failed [Log ID: ${
              log?.id || "N/A"
            }]:`,
            error.message
          );

          // Log error
          if (log) {
            await log.logError(error);
          }
        }
      });

      // Add delay between jobs to avoid overwhelming the WhatsApp API
      if (i < jobs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Get logs for a specific kodePendaftaran
   * @param {string} kodePendaftaran
   * @returns {Promise<Array>}
   */
  async getLogs(kodePendaftaran) {
    return await WhatsappLog.query()
      .where("kode_pendaftaran", kodePendaftaran)
      .orderBy("created_at", "desc")
      .fetch();
  }

}

module.exports = new WhatsappBackgroundService();
