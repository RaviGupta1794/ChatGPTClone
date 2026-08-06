import {body} from 'express-validator';

//--signup validation

export const signupValidation = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({min : 3})
    .withMessage("Name must be at least 3 characters long"),

    body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

    body("password")
    .trim()
    .isLength({min : 6})
    .withMessage("Password must be at least 6 characters long"),
];
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];