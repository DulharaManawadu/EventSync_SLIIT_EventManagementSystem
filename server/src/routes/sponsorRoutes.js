const express = require("express");

const {
  applySponsor,
  getSponsors,
  getSponsorsByEvent,
  approveSponsor,
  rejectSponsor,
  getTierSummary,
  getApprovedSponsorsWithEvents,
  deleteAllSponsors
} = require("../controllers/sponsorController");

// ✅ Correct import
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// APPLY
router.post("/", requireRole("Sponsor"), applySponsor);

// GET ALL
router.get("/", requireAuth, getSponsors);

// FILTER
router.get("/filter", requireAuth, getSponsorsByEvent);

// APPROVE (Admin)
router.put("/approve/:id", requireRole("Admin"), approveSponsor);

// REJECT (Admin)
router.put("/reject/:id", requireRole("Admin"), rejectSponsor);

// SUMMARY
router.get("/summary/:eventId", requireAuth, getTierSummary);

// REPORT
router.get("/approved/all", requireAuth, getApprovedSponsorsWithEvents);

// DELETE ALL (Admin)
router.delete("/all", requireRole("Admin"), deleteAllSponsors);

module.exports = router;