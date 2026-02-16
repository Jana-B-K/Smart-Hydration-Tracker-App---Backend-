/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User profile operations
 *
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: newpass123
 *         age:
 *           type: string
 *           example: "25"
 *         gender:
 *           type: string
 *           enum: [male, female, others]
 *           example: female
 *         weight:
 *           type: number
 *           example: 60
 *         height:
 *           type: number
 *           example: 166
 *         activity:
 *           type: string
 *           enum: [low, moderate, high]
 *           example: high
 *         climate:
 *           type: string
 *           enum: [cold, moderate, hot]
 *           example: hot
 *         userType:
 *           type: string
 *           enum: [Athlete, Office worker, Outdoor worker, Pregnant, Senior citizen]
 *           example: Office worker
 *
 *     UpdateFcmTokenRequest:
 *       type: object
 *       required:
 *         - fcmToken
 *       properties:
 *         fcmToken:
 *           type: string
 *           example: d8f8s-xxxxx-fcm-token
 *
 * /user/profile:
 *   get:
 *     tags: [User]
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   put:
 *     tags: [User]
 *     summary: Update logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
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
 * /user/fcm-token:
 *   put:
 *     tags: [User]
 *     summary: Save or update FCM token for logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFcmTokenRequest'
 *     responses:
 *       200:
 *         description: Updated user with fcmToken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Missing/invalid fcmToken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
