import express from "express";
import { addFeatureImage, getFeatureImages } from "../../controllers/common/feature-controller.js";

const router = express.Router();

router.get("/get", getFeatureImages);
router.post("/add", addFeatureImage);


export default router;