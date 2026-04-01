const express = require("express");
const {
  createResource,
  getResources,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

const router = express.Router();

// CREATE
router.post("/", createResource);

// READ
router.get("/", getResources);

// UPDATE
router.put("/:id", updateResource);

// DELETE
router.delete("/:id", deleteResource);

module.exports = router;