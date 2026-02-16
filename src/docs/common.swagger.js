/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65fc9d73d66dc8a8bc3ad881
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           example: jane@example.com
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
 *         dailyGoal:
 *           type: number
 *           example: 2800
 *         unit:
 *           type: string
 *           enum: [ml, oz]
 *           example: ml
 *         fcmToken:
 *           type: string
 *           nullable: true
 *           example: d8f8s-xxxxx-fcm-token
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Logged out
 */
