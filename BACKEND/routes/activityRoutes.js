const express = require("express");

const router = express.Router();

const Authorization = require("../middleware/Authorization");
const { getHistory } = require("../controllers/activityController");

router.get("/", Authorization, getHistory);

module.exports = router;
