const express = require("express");
const jwtAuth = require("../middleware/auth");
const { searchResumeByName } = require("../controllers/searchController");
const router = express.Router();

router.post("/", jwtAuth, searchResumeByName);

module.exports = router;
