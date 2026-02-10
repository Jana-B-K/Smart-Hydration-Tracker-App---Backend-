import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .notEmpty().withMessage("Name is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required to register")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .isLength({min: 4})
        .withMessage("Password must atleast 4"),
    body("age")
        .notEmpty()
        .withMessage("Age is required"),
    body("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["male", "female", "others"])
        .withMessage("Gender must be male, female, or others"),
    body("weight")
        .notEmpty()
        .withMessage("weight is required")
        .isNumeric()
        .withMessage("Weight must be number"),
    body("height")
        .notEmpty()
        .withMessage("height is required")
        .isNumeric()
        .withMessage("height must be number"),
    body("activity")
        .notEmpty()
        .withMessage("activity is required")
        .isIn(["low", "high", "moderate"])
        .withMessage("activity must be low, high, or moderate"),
    body("climate")
        .notEmpty()
        .withMessage("climate is required")
        .isIn(["cold", "hot", "moderate"])
        .withMessage("climate must be cold, hot, or moderate"),
    body("pregnancy")
        .optional()
        .isBoolean()
        .withMessage("pregnancy must be boolean"),
    
]

export const updateUserValidation = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("Name cannot be empty"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .optional()
        .isLength({min: 4})
        .withMessage("Password must atleast 4"),
    body("age")
        .optional()
        .notEmpty()
        .withMessage("Age cannot be empty"),
    body("gender")
        .optional()
        .isIn(["male", "female", "others"])
        .withMessage("Gender must be male, female, or others"),
    body("weight")
        .optional()
        .isNumeric()
        .withMessage("Weight must be number"),
    body("height")
        .optional()
        .isNumeric()
        .withMessage("height must be number"),
    body("activity")
        .optional()
        .isIn(["low", "high", "moderate"])
        .withMessage("activity must be low, high, or moderate"),
    body("climate")
        .optional()
        .isIn(["cold", "hot", "moderate"])
        .withMessage("climate must be cold, hot, or moderate"),
    body("pregnancy")
        .optional()
        .isBoolean()
        .withMessage("pregnancy must be boolean"),
]
