import Users from '../models/user.model.js';
import * as analyticsService from '../services/analytics.service.js';

export const getWeeklyData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getWeeklyData(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDailyHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const days = req.query.days;
    const result = await analyticsService.getDailyHistory(userId, days);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getWeeklyPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user?.dailyGoal ?? 0;
    const result = await analyticsService.getWeeklyPerformance(userId, goal);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getMonthlyAnalytics(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMonthlyComparison = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getMonthlyComparison(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const streakCalculation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user.dailyGoal
    
    const result = await analyticsService.streakCalculation(userId, goal);
    res.status(200).json({ streak: result });
  } catch (err) {
    next(err);
  }
};

export const getStreakBadge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user?.dailyGoal ?? 0;
    const streak = await analyticsService.streakCalculation(userId, goal);
    const badge = analyticsService.getStreakBadge(streak);
    res.status(200).json({ streak, badge });
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId)
    const { start, end, format } = req.query;
    const report = await analyticsService.getExportReport(userId, start, end);
    const normalizedFormat = String(format || 'json').toLowerCase();

    if (normalizedFormat === 'pdf') {
      const { default: PDFDocument } = await import('pdfkit');
      const fileStamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `hydration-report-${fileStamp}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      doc.pipe(res);

      doc.fontSize(18).text('Hydration Report', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .text(`username: ${user.name}`)
        .text(`User ID: ${userId}`)
        .text(`Start: ${start || 'today'}`)
        .text(`End: ${end || 'today'}`)
        .text(`Generated: ${new Date().toISOString()}`);

      doc.moveDown(1);
      doc.fontSize(12).text('Daily Intake');
      doc.moveDown(0.4);

      let grandTotal = 0;
      report.forEach((item, index) => {
        const amount = Number(item.total) || 0;
        grandTotal += amount;
        doc.fontSize(10).text(`${index + 1}. ${item.day} - ${amount} ml`);
      });

      doc.moveDown(1);
      doc.fontSize(12).text(`Total Intake: ${grandTotal} ml`);
      doc.end();
      return;
    }

    if (normalizedFormat !== 'json') {
      const err = new Error("Invalid format. Use 'json' or 'pdf'.");
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({ report, format: 'json' });
  } catch (err) {
    next(err);
  }
};

export const calculateHydrationScore = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const user = await Users.findById(userId);
    const goal = user.dailyGoal
    const result = await analyticsService.calculateHydrationScore(userId, goal);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
