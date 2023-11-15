const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { makeTransaction } = require("../controllers/transactionController");

// @route   POST /api/transactions
// @desc    Make a transaction
// @access  Private
router.post("/", authMiddleware, makeTransaction);

module.exports = router;

