"use strict";

const WhatsappBackgroundService = use("App/Services/WhatsappBackgroundService");
const WhatsappLog = use("App/Models/WhatsappLog");
const Database = use("Database");

class WhatsappLogController {
  async index({ request, response }) {
    try {
      const status = request.input("status");

      let query = WhatsappLog.query().orderBy("created_at", "desc");

      if (status) {
        query = query.where("status", status);
      }

      const logs = await query.fetch()
      return response.json(logs);
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async stats({ response }) {
    try {
      // Use Database.raw for aggregation queries
      const statsResult = await Database.from("whatsapp_logs")
        .select("status")
        .count("* as total")
        .groupBy("status");

      const result = {
        total: 0,
        success: 0,
        failed: 0,
        pending: 0,
        retrying: 0,
      };

      // Process the results
      statsResult.forEach((stat) => {
        const status = stat.status;
        const total = parseInt(stat.total);
        result[status] = total;
        result.total += total;
      });

      // Calculate success rate
      const successRate =
        result.total > 0
          ? Math.round((result.success / result.total) * 100)
          : 0;

      return response.json({
        ...result,
        success_rate: successRate,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      return response.status(500).json({
        message: "Failed to fetch statistics",
        error: error.message,
      });
    }
  }

  async resend({ request, response }) {
    try {
      const { id } = request.only(["id"]);

      if (!id) {
        return response.status(400).json({
          message: "Log ID is required",
        });
      }

      const log = await WhatsappLog.find(id);

      if (!log) {
        return response.status(404).json({
          message: "Log not found",
        });
      }

      if (log.status === "success") {
        return response.status(400).json({
          message: "Cannot resend successful messages",
        });
      }

      if (log.status === "pending" || log.status === "retrying") {
        return response.status(400).json({
          message: "Message is already being processed",
        });
      }

      // Update log status untuk retry dan reset error details
      log.status = "retrying";
      log.attempt = (log.attempt || 0) + 1;
      log.started_at = new Date();
      log.completed_at = null;
      log.processing_time_ms = null;
      log.error_details = null;
      log.response_data = null;
      await log.save();

      // Resend the WhatsApp message dengan log ID yang sama
      WhatsappBackgroundService.fireAndForgetWithRetryExistingLog(
        log.method,
        log.kode_pendaftaran,
        3,
        log.id
      );

      return response.json({
        message: "Message resend initiated successfully",
        log_id: log.id,
        kode_pendaftaran: log.kode_pendaftaran,
        method: log.method,
        attempt: log.attempt,
      });
    } catch (error) {
      console.error("Error resending message:", error);
      return response.status(500).json({
        message: "Failed to resend message",
        error: error.message,
      });
    }
  }

  /**
   * Bulk resend failed messages
   * POST /whatsapp-log/bulk-resend
   */
  async bulkResend({ request, response }) {
    try {
      const { ids } = request.only(["ids"]);

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return response.status(400).json({
          message: "Array of log IDs is required",
        });
      }

      const logs = await WhatsappLog.query()
        .whereIn("id", ids)
        .where("status", "failed")
        .fetch();

      if (logs.rows.length === 0) {
        return response.status(404).json({
          message: "No failed logs found for the provided IDs",
        });
      }

      const resendCount = logs.rows.length;

      // Update each log status dan resend
      for (const log of logs.rows) {
        // Update log status untuk retry
        log.status = "retrying";
        log.attempt = (log.attempt || 0) + 1;
        log.started_at = new Date();
        log.completed_at = null;
        log.processing_time_ms = null;
        log.error_details = null;
        log.response_data = null;
        await log.save();

        // Resend dengan log ID yang sama
        WhatsappBackgroundService.fireAndForgetWithRetryExistingLog(
          log.method,
          log.kode_pendaftaran,
          3,
          log.id
        );
      }

      return response.json({
        message: `${resendCount} messages resend initiated successfully`,
        resend_count: resendCount,
        logs: logs.rows.map((log) => ({
          id: log.id,
          kode_pendaftaran: log.kode_pendaftaran,
          method: log.method,
          attempt: log.attempt,
        })),
      });
    } catch (error) {
      console.error("Error bulk resending messages:", error);
      return response.status(500).json({
        message: "Failed to bulk resend messages",
        error: error.message,
      });
    }
  }
}

module.exports = WhatsappLogController;
