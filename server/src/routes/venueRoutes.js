const express = require("express");
const {
  createVenue,
  getVenues,
  updateVenue,
  deleteVenue
} = require("../controllers/venueController");

const router = express.Router();

// CREATE
router.post("/", createVenue);

// READ
router.get("/", getVenues);

// UPDATE
router.put("/:id", updateVenue);

// DELETE
router.delete("/:id", deleteVenue);

module.exports = router;