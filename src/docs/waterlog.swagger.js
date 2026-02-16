/**
 * @swagger
 * tags:
 *   - name: WaterLog
 *     description: Water intake logging and daily summary
 *
 * components:
 *   schemas:
 *     AddWaterIntakeRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 1
 *           example: 300
 *
 *     UpdateWaterIntakeRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 1
 *           example: 450
 *
 *     WaterLogItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec1234
 *         userId:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec5678
 *         amount:
 *           type: number
 *           example: 300
 *         day:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T10:12:33.120Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T10:12:33.120Z
 *
 *     DailySummaryResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           example: 2200
 *         logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WaterLogItem'
 *
 * /water/add:
 *   post:
 *     tags: [WaterLog]
 *     summary: Add water intake entry for today
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWaterIntakeRequest'
 *     responses:
 *       201:
 *         description: Water intake log created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterLogItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /water/{id}:
 *   put:
 *     tags: [WaterLog]
 *     summary: Update a water intake entry by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Water log id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWaterIntakeRequest'
 *     responses:
 *       200:
 *         description: Water intake log updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterLogItem'
 *       404:
 *         description: Log not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   delete:
 *     tags: [WaterLog]
 *     summary: Delete a water intake entry by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Water log id
 *     responses:
 *       200:
 *         description: Water intake log deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterLogItem'
 *       404:
 *         description: Log not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /water/daily:
 *   get:
 *     tags: [WaterLog]
 *     summary: Get today's total intake and logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily intake summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailySummaryResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
