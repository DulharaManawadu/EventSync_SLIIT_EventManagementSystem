const express = require("express");
const {
  applySponsor,
  getSponsors,
  approveSponsor,
  rejectSponsor
} = require("../controllers/sponsorController");

const router = express.Router();

// APPLY
router.post("/", applySponsor);

// GET ALL
router.get("/", getSponsors);

// APPROVE
router.put("/approve/:id", approveSponsor);

// REJECT
router.put("/reject/:id", rejectSponsor);

module.exports = router;