"use strict";

const WhatsappBackgroundService = use("App/Services/WhatsappBackgroundService");
const WhatsappLog = use("App/Models/WhatsappLog");
const Database = use('Database');

class WhatsappLogController {
  async index({ request, response }) {
    try {
      const page = request.input("page", 1);
      const limit = request.input("limit", 20);
      const status = request.input("status");

      let query = WhatsappLog.query().orderBy("created_at", "desc");

      if (status) {
        query = query.where("status", status);
      }

      const logs = await query.paginate(page, limit);
      return response.json(logs);
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }

  async stats({ response }) {
    try {
      // Use Database.raw for aggregation queries
      const statsResult = await Database
        .from('whatsapp_logs')
        .select('status')
        .count('* as total')
        .groupBy('status');

      const result = {
        total: 0,
        success: 0,
        failed: 0,
        pending: 0,
        retrying: 0
      };

      // Process the results
      statsResult.forEach((stat) => {
        const status = stat.status;
        const total = parseInt(stat.total);
        result[status] = total;
        result.total += total;
      });

      // Calculate success rate
      const successRate = result.total > 0
        ? Math.round((result.success / result.total) * 100)
        : 0;

      return response.json({
        ...result,
        success_rate: successRate
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return response.status(500).json({
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
}

module.exports = WhatsappLogController;
