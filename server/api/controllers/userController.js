require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/userModel");

// const jwtSecret = process.env.JWT_SECRET;

async function registerUser(req, res) {
  const { username, password, name, address, dateOfBirth } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user with KYC information and initial balance
    user = new User({
      username,
      password,
      kycInfo: {
        name,
        address,
        dateOfBirth,
      },
      balance: 1000, // Set an initial balance (adjust as needed)
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}


async function getUserBalance(req, res) {
  try {
    const user = await User.findById(req.user.id).select("balance");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

async function getUserProfile(req, res) {
  try {
    // Get user information based on the user ID stored in the request object by the authMiddleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

module.exports = { registerUser, loginUser, getUserProfile, getUserBalance };
