const mongoose = require('mongoose');
const Sponsor = require('../models/Sponsor');

// ⭐ Tier Limits
const TIER_LIMITS = {
  Gold: 2,
  Silver: 3,
  Bronze: 5
};


// ================= APPLY =================
const applySponsor = async (req, res) => {
  try {

    // 🔐 Only Sponsor users allowed
    if (req.user.userType !== "Sponsor") {
      return res.status(403).json({
        message: "Only sponsors can apply"
      });
    }

    const { tier, contributionAmount, event } = req.body;

    if (!tier || !contributionAmount || !event) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    // ✅ Prevent duplicate application by same user
    const existing = await Sponsor.findOne({
      event,
      createdBy: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        message: "You already applied for this event"
      });
    }

    const sponsor = await Sponsor.create({
      tier,
      contributionAmount,
      event,
      createdBy: req.user.id,
      status: "Pending"
    });

    res.status(201).json(sponsor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL =================
const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find()
      .populate("event")
      .populate("createdBy", "firstName lastName email contactNumber");

    res.json(sponsors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= FILTER + SORT =================
const getSponsorsByEvent = async (req, res) => {
  try {
    const { eventId, status, tier, sortBy } = req.query;

    const filter = {};

    if (eventId) filter.event = eventId;
    if (status) filter.status = status;
    if (tier) filter.tier = tier;

    let query = Sponsor.find(filter)
      .populate("event")
      .populate("createdBy", "firstName lastName email contactNumber");

    // Sorting
    if (sortBy === "amount") {
      query = query.sort({ contributionAmount: -1 });
    } else if (sortBy === "priority") {
      query = query.sort({ priorityScore: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const sponsors = await query;

    res.json(sponsors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= APPROVE =================
const approveSponsor = async (req, res) => {
  try {

    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    if (sponsor.status === "Rejected") {
      return res.status(400).json({
        message: "Rejected sponsor cannot be approved"
      });
    }

    // Count approved in same event + tier
    const approvedCount = await Sponsor.countDocuments({
      event: sponsor.event,
      tier: sponsor.tier,
      status: "Approved"
    });

    const limit = TIER_LIMITS[sponsor.tier];

    if (approvedCount >= limit) {
      return res.status(400).json({
        message: `${sponsor.tier} tier limit reached (${limit})`
      });
    }

    sponsor.status = "Approved";
    sponsor.rejectionReason = null;
    sponsor.approvedBy = req.user.id;

    await sponsor.save();

    res.json({
      message: "Sponsor approved",
      sponsor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= REJECT =================
const rejectSponsor = async (req, res) => {
  try {

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        message: "Rejection reason is required"
      });
    }

    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    sponsor.status = "Rejected";
    sponsor.rejectionReason = reason;
    sponsor.approvedBy = req.user.id;

    await sponsor.save();

    res.json({
      message: "Sponsor rejected",
      sponsor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= TIER SUMMARY =================
const getTierSummary = async (req, res) => {
  try {

    const { eventId } = req.params;

    const summary = await Sponsor.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId)
        }
      },
      {
        $group: {
          _id: "$tier",
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Approved"] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= APPROVED REPORT =================
const getApprovedSponsorsWithEvents = async (req, res) => {
  try {

    const sponsors = await Sponsor.find({ status: "Approved" })
      .populate("event")
      .populate("createdBy", "firstName lastName companyName email contactNumber")
      .sort({ "event.title": 1 });

    res.json(sponsors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllSponsors = async (req, res) => {
  try {
    await Sponsor.deleteMany({});
    res.json({ message: "All sponsors deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  applySponsor,
  getSponsors,
  getSponsorsByEvent,
  approveSponsor,
  rejectSponsor,
  getTierSummary,
  getApprovedSponsorsWithEvents,
  deleteAllSponsors
};