const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// /api rotası
router.get("/", indexController.getHomeMessage);

module.exports = router;
