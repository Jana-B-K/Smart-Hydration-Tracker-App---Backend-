/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and session management
 *
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - age
 *         - gender
 *         - weight
 *         - height
 *         - activity
 *         - climate
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jan@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: pass1234
 *         age:
 *           type: string
 *           example: "24"
 *         gender:
 *           type: string
 *           enum: [male, female, others]
 *           example: female
 *         weight:
 *           type: number
 *           example: 58
 *         height:
 *           type: number
 *           example: 165
 *         activity:
 *           type: string
 *           enum: [low, moderate, high]
 *           example: moderate
 *         climate:
 *           type: string
 *           enum: [cold, moderate, hot]
 *           example: moderate
 *         userType:
 *           type: string
 *           enum: [Athlete, Office worker, Outdoor worker, Pregnant, Senior citizen]
 *           example: Athlete
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: jana@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: 12345678
 *
 *     RefreshRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Optional when token is sent in cookie
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     AuthTokensResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     AccessTokenResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created
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
 *       500:
 *         description: Server error
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and return access/refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokensResponse'
 *       400:
 *         description: Invalid credentials or input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Create new access token from refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Access token generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessTokenResponse'
 *       400:
 *         description: Missing/invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 *
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user and clear refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 */
