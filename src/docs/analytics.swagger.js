/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Hydration analytics and reporting
 *
 * components:
 *   schemas:
 *     DailyTotalItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T00:00:00.000Z
 *         total:
 *           type: number
 *           example: 2400
 *
 *     DailyHistoryItem:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           example: 2026-02-16
 *         total:
 *           type: number
 *           example: 2400
 *
 *     WaterLogItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec90ab
 *         userId:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec5678
 *         amount:
 *           type: number
 *           example: 250
 *         day:
 *           type: string
 *           format: date-time
 *           example: 2026-02-19T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-19T09:10:05.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-19T09:10:05.000Z
 *
 *     HistoryByDateResponse:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *           example: 2026-02-19
 *         total:
 *           type: number
 *           example: 1250
 *         logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WaterLogItem'
 *
 *     WeeklyPerformanceResponse:
 *       type: object
 *       properties:
 *         totalIntake:
 *           type: number
 *           example: 12000
 *         expectedTotal:
 *           type: number
 *           example: 14000
 *         daysMet:
 *           type: number
 *           example: 5
 *         totalDays:
 *           type: number
 *           example: 7
 *         percentOfGoal:
 *           type: number
 *           example: 86
 *         percentDaysMet:
 *           type: number
 *           example: 71
 *
 *     MonthlyComparisonResponse:
 *       type: object
 *       properties:
 *         currentTotal:
 *           type: number
 *           example: 56000
 *         previousTotal:
 *           type: number
 *           example: 50000
 *         delta:
 *           type: number
 *           example: 6000
 *         percentChange:
 *           type: number
 *           example: 12
 *
 *     StreakResponse:
 *       type: object
 *       properties:
 *         streak:
 *           type: number
 *           example: 4
 *
 *     StreakBadgeResponse:
 *       type: object
 *       properties:
 *         streak:
 *           type: number
 *           example: 10
 *         badge:
 *           type: string
 *           enum: [Starter, Bronze, Silver, Gold, Platinum]
 *           example: Silver
 *
 *     HydrationScoreResponse:
 *       type: object
 *       properties:
 *         todayTotal:
 *           type: number
 *           example: 2100
 *         dailyGoal:
 *           type: number
 *           example: 2500
 *         percentage:
 *           type: number
 *           example: 84
 *         score:
 *           type: number
 *           enum: [0, 50, 80, 100]
 *           example: 80
 *
 *     ExportReportResponse:
 *       type: object
 *       properties:
 *         report:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DailyHistoryItem'
 *         format:
 *           type: string
 *           example: json
 *
 * /analytics/weekly:
 *   get:
 *     tags: [Analytics]
 *     summary: Get current week totals grouped by day
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly totals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyTotalItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/daily-history:
 *   get:
 *     tags: [Analytics]
 *     summary: Get daily history for the last N days
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 7
 *         required: false
 *         description: Number of days to include. Defaults to 7.
 *     responses:
 *       200:
 *         description: Daily history with missing days filled as 0
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyHistoryItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/history-by-date:
 *   get:
 *     tags: [Analytics]
 *     summary: Get all water logs for a specific day
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-02-19
 *         required: true
 *         description: Day to fetch logs for, in YYYY-MM-DD format (UTC day).
 *     responses:
 *       200:
 *         description: Water logs and total for the requested day
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryByDateResponse'
 *       400:
 *         description: Missing or invalid date query
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/weekly-performance:
 *   get:
 *     tags: [Analytics]
 *     summary: Get weekly goal performance summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly performance summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeeklyPerformanceResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/monthly:
 *   get:
 *     tags: [Analytics]
 *     summary: Get current month totals grouped by day
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly totals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DailyTotalItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/monthly-comparison:
 *   get:
 *     tags: [Analytics]
 *     summary: Compare current month total vs previous month
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly comparison
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MonthlyComparisonResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/streak:
 *   get:
 *     tags: [Analytics]
 *     summary: Get current streak count for meeting daily goal
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StreakResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/streak-badge:
 *   get:
 *     tags: [Analytics]
 *     summary: Get streak with badge label
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak and badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StreakBadgeResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/hydration:
 *   get:
 *     tags: [Analytics]
 *     summary: Get hydration score for today
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hydration score details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HydrationScoreResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /analytics/export:
 *   get:
 *     tags: [Analytics]
 *     summary: Export report as JSON or PDF for a date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-02-01
 *       - in: query
 *         name: end
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-02-16
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [json, pdf]
 *           example: json
 *         description: pdf currently returns 501
 *     responses:
 *       200:
 *         description: Exported report based on requested format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExportReportResponse'
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid format value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
