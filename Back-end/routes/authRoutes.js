const express = require("express");
const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

// Middleware to check database connection
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: "Database not connected. Please try again later." 
    });
  }
  next();
};

// login
router.post("/login", async function (request, response) {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(400).json({ message: "Invalid Credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret_123", {
      expiresIn: "7d",
    });

    response.json({
      message: "User Login Successfully.",
      data: {
        token,
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error." });
  }
});

// register
router.post("/register", checkDBConnection, async function (request, response) {
  try {
    console.log("Register request received:", request.body);
    const { email, password, name, role } = request.body;

    // Validation
    if (!email || !password || !name) {
      return response.status(400).json({ 
        message: "Please provide email, password, and name." 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ 
        message: "Please provide a valid email address." 
      });
    }

    // Password validation
    if (password.length < 6) {
      return response.status(400).json({ 
        message: "Password must be at least 6 characters long." 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ message: "User Already Exist." });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

    console.log("Creating user in database...");
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      name, 
      role: role || "user" 
    });
    console.log("User created successfully:", user.email);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret_123", {
      expiresIn: "7d",
    });  

    response.status(201).json({
      message: "User Registered Successfully!",
      data: {
        token,
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("Registration Error:", error);
    console.log("Error name:", error.name);
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    
    // Handle MongoDB connection errors
    if (error.name === "MongoServerError" || error.name === "MongoNetworkError") {
      return response.status(500).json({ 
        message: "Database connection error. Please try again later." 
      });
    }
    
    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return response.status(400).json({ 
        message: messages.join(", ") 
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return response.status(409).json({ 
        message: "Email already exists." 
      });
    }
    
    // Handle bcrypt errors
    if (error.message && error.message.includes("bcrypt")) {
      return response.status(500).json({ 
        message: "Password encryption error. Please try again." 
      });
    }
    
    response.status(500).json({ 
      message: error.message || "Internal Server Error. Please check server logs." 
    });
  }
});

// Forget Password
router.post("/forget-password", checkDBConnection, async function (request, response) {
  try {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({ 
        message: "Please provide your email address." 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ 
        message: "Please provide a valid email address." 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return response.status(404).json({ 
        message: "Email not found. Please check your email or create a new account." 
      });
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the database with expiration
    // 3. Send an email with the reset link
    // For now, we'll just return a success message
    
    response.json({
      message: "Password reset instructions have been sent to your email!",
      // In production, don't send this:
      note: "In production, a reset link would be sent to your email."
    });
  } catch (error) {
    console.log("Forget Password Error:", error);
    response.status(500).json({ 
      message: error.message || "Internal Server Error." 
    });
  }
});

module.exports = router;
