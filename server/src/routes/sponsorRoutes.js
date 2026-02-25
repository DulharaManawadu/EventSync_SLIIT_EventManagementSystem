import express from "express";
import {
  applySponsor,
  getSponsors,
  approveSponsor,
  rejectSponsor
} from "../controllers/sponsorController.js";

const router = express.Router();

// APPLY
router.post("/", applySponsor);

// GET ALL
router.get("/", getSponsors);

// APPROVE
router.put("/approve/:id", approveSponsor);

// REJECT
router.put("/reject/:id", rejectSponsor);

export default router;