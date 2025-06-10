
/**
 * Description: This file handles authentication controllers
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { initializeHabitsForUser } from "../services/initializeUserHabits.js";

dotenv.config();

/**
 * Create user registration for the logged-in user
 * @route POSt /api/auth/register
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering new user:", name, email);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const profile = await Profile.create({
      userId: user._id,
      name: user.name || "John Doe",
      bio: "This is my bio.",
      goals: [],
    });

    await initializeHabitsForUser(user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, name, email },
      profile,
    });
  } catch (error) {
    console.error("Error creating user and profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to register user",
      error: error.message,
    });
  }
};

/**
 * User LogIn
 * @route POST /api/auth/login
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "error", error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Login failed",
      error: error.message,
    });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

/**
 * Password retrieval
 * @route POST /api/auth/forgot-password
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ message: "If the email exists, a reset link will be sent." }); // Don't expose user existence

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // add this to .env
        pass: process.env.EMAIL_PASS, // add this to .env
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>You requested a password reset. Click the link below:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent if email exists" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Reset password
 * @route POST /api/auth/forgot-password/:token
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Could not reset password" });
  }
};

