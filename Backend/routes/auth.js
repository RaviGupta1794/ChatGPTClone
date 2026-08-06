import express from "express";
import { signup,login,getCurrentUser} from "../controller/authController.js";
import {signupValidation,loginValidation} from '../validators/authValidators.js';
import fetchUser from "../middlewares/fetchUser.js";
const router = express.Router();

router.post("/signup",signupValidation,signup);
router.post("/login",loginValidation,login);
router.get("/me",fetchUser,getCurrentUser);

export default router;