/**
 * @swagger
 * tags:
 *   - name: Reminder
 *     description: Reminder setup and control
 *
 * components:
 *   schemas:
 *     AddReminderRequest:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *       properties:
 *         interval:
 *           type: number
 *           minimum: 1
 *           description: Minutes between reminders. If omitted, service may derive from user type.
 *           example: 60
 *         startTime:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "22:00"
 *         isActive:
 *           type: boolean
 *           example: true
 *         sleepMode:
 *           type: boolean
 *           example: false
 *         paused:
 *           type: boolean
 *           example: false
 *
 *     UpdateReminderRequest:
 *       type: object
 *       properties:
 *         interval:
 *           type: number
 *           minimum: 1
 *           example: 45
 *         startTime:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "21:00"
 *         isActive:
 *           type: boolean
 *           example: true
 *         sleepMode:
 *           type: boolean
 *           example: false
 *         paused:
 *           type: boolean
 *           example: false
 *         lastReminderSent:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T10:00:00.000Z
 *
 *     PauseReminderRequest:
 *       type: object
 *       properties:
 *         pauseStartTime:
 *           type: string
 *           nullable: true
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "13:00"
 *         pauseEndTime:
 *           type: string
 *           nullable: true
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "15:00"
 *       description: Send both times to set a pause window. Send both as null to clear pause window.
 *
 *     ReminderResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec90ab
 *         userId:
 *           type: string
 *           example: 67b1c5714f8b92a2f4ec5678
 *         interval:
 *           type: number
 *           example: 60
 *         startTime:
 *           type: string
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           example: "22:00"
 *         isActive:
 *           type: boolean
 *           example: true
 *         sleepMode:
 *           type: boolean
 *           example: false
 *         paused:
 *           type: boolean
 *           example: false
 *         pauseStartTime:
 *           type: string
 *           nullable: true
 *           example: "13:00"
 *         pauseEndTime:
 *           type: string
 *           nullable: true
 *           example: "15:00"
 *         lastReminderSent:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-02-16T10:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T09:10:05.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-16T09:10:05.000Z
 *
 * /reminder:
 *   post:
 *     tags: [Reminder]
 *     summary: Create or upsert reminder for logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddReminderRequest'
 *     responses:
 *       201:
 *         description: Reminder created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderResponse'
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
 *   get:
 *     tags: [Reminder]
 *     summary: Get reminder for logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reminder found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderResponse'
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /reminder/update:
 *   put:
 *     tags: [Reminder]
 *     summary: Update reminder for logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReminderRequest'
 *     responses:
 *       200:
 *         description: Reminder updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderResponse'
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
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
 * /reminder/pause:
 *   put:
 *     tags: [Reminder]
 *     summary: Pause or unpause reminder
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PauseReminderRequest'
 *     responses:
 *       200:
 *         description: Reminder pause state updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderResponse'
 *       400:
 *         description: pauseStartTime and pauseEndTime must be in HH:mm format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /reminder/toggle-sleep-mode:
 *   put:
 *     tags: [Reminder]
 *     summary: Toggle sleep mode on/off
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reminder sleep mode toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReminderResponse'
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
