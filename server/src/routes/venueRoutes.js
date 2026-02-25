import express from "express";
import {
  createVenue,
  getVenues,
  updateVenue,
  deleteVenue
} from "../controllers/venueController.js";

const router = express.Router();

// CREATE
router.post("/", createVenue);

// READ
router.get("/", getVenues);

// UPDATE
router.put("/:id", updateVenue);

// DELETE
router.delete("/:id", deleteVenue);

export default router;