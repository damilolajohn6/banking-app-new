const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

async function makeTransaction(req, res) {
  try {
    const { receiverId, amount } = req.body;
    const senderId = req.user.id;

    // Check if sender and receiver exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ msg: "Sender or receiver not found" });
    }

    // Check if the sender has sufficient balance
    if (sender.balance < amount) {
      return res
        .status(400)
        .json({ msg: "Insufficient balance for the transaction" });
    }

    // Validate the transaction amount
    if (amount <= 0) {
      return res.status(400).json({ msg: "Invalid transaction amount" });
    }

    // Create a new transaction
    const transaction = new Transaction({
      sender: senderId,
      receiver: receiverId,
      amount,
    });

    // Update sender and receiver balances
    sender.balance -= amount;
    receiver.balance += amount;

    // Save the transaction and update user balances
    await Promise.all([transaction.save(), sender.save(), receiver.save()]);

    res.json({ msg: "Transaction successful", transaction });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { makeTransaction };
