import express from 'express';
import { signup ,signin , logout ,getMe} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleWare/protectRoute.js';

const router = express.Router();

router.get("/me",protectRoute,getMe);
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/logout",logout);
 

export default router;
