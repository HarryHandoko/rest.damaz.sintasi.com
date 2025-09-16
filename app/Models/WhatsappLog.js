"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class WhatsappLog extends Model {
  static get table() {
    return "whatsapp_logs";
  }

  static get dates() {
    return super.dates.concat(["started_at", "completed_at"]);
  }

  // Helper methods
  static async logStart(kodePendaftaran, method, maxRetries = 1) {
    return await this.create({
      kode_pendaftaran: kodePendaftaran,
      method: method,
      status: "pending",
      attempt: 1,
      max_retries: maxRetries,
      started_at: new Date(),
    });
  }

  async logSuccess(responseData = null, processingTime = null) {
    this.status = "success";
    this.completed_at = new Date();
    this.response_data = responseData ? JSON.stringify(responseData) : null;
    this.processing_time_ms = processingTime;
    await this.save();
  }

  async logError(error, attempt = null) {
    this.status = attempt && attempt < this.max_retries ? "retrying" : "failed";
    this.attempt = attempt || this.attempt;
    this.error_details = error.stack || error.message;
    this.message = error.message;
    if (this.status === "failed") {
      this.completed_at = new Date();
    }
    await this.save();
  }

  async logRetry(attempt) {
    this.status = "retrying";
    this.attempt = attempt;
    this.message = `Retrying attempt ${attempt}/${this.max_retries}`;
    await this.save();
  }
}

module.exports = WhatsappLog;
