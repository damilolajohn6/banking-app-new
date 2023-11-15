const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  kycInfo: kycSchema,
});

// Generate a unique 10-digit account number before saving a new user
userSchema.pre("save", async function (next) {
  try {
    // Generate a random 10-digit number
    const generatedAccountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    // Check if the generated account number already exists
    const existingUser = await this.constructor.findOne({
      accountNumber: generatedAccountNumber,
    });

    // If it exists, generate a new one
    if (existingUser) {
      return next();
    }

    this.accountNumber = generatedAccountNumber;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
