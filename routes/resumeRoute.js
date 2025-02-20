const express = require("express");
const jwtAuth = require("../middleware/auth");
const resumeController = require("../controllers/resumeController");
const router = express.Router();

router.post("/extract", jwtAuth, resumeController);

module.exports = router;
