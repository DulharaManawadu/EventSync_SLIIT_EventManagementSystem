import Sponsor from "../models/Sponsor.js";

// APPLY SPONSOR
export const applySponsor = async (req, res) => {
  try {
    const {
      companyName,
      contactEmail,
      contactPhone,
      website,
      logoUrl,
      tier,
      contributionAmount,
      event
    } = req.body;

    if (!companyName || !contactEmail || !tier || !contributionAmount || !event) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prevent duplicate application
    const existing = await Sponsor.findOne({ companyName, event });
    if (existing) {
      return res.status(400).json({
        message: "Sponsor already applied for this event"
      });
    }

    const sponsor = await Sponsor.create(req.body);

    res.status(201).json(sponsor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SPONSORS
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().populate("event");
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE SPONSOR
export const approveSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    sponsor.status = "Approved";
    sponsor.rejectionReason = null;

    await sponsor.save();

    res.json({ message: "Sponsor approved", sponsor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT SPONSOR
export const rejectSponsor = async (req, res) => {
  try {
    const { reason } = req.body;

    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    sponsor.status = "Rejected";
    sponsor.rejectionReason = reason;

    await sponsor.save();

    res.json({ message: "Sponsor rejected", sponsor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};