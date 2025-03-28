const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    try {
      const { username, password, email, phone, postalCode } = req.body;
      
      // Validate postal code: exactly 6 digits
      if (!/^\d{6}$/.test(postalCode)) {
        return res.status(400).json({ message: 'Postal code must be exactly 6 digits.' });
      }
      
      // Validate phone number: exactly 8 digits
      if (!/^\d{8}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 8 digits.' });
      }
      
      // Check for duplicate username
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password too short.' });
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userModel.createUser({
        username,
        passwordHash,
        email,
        phone,
        postalCode,
      });
      
      // Generate OTP and expiry (still doing this; you can remove if not needed)
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60000);
      await userModel.updateOTP(newUser.id, otp, expiresAt);
      
      console.log(`OTP for ${phone}: ${otp}`);
      
      res.status(201).json({ message: 'User registered. OTP sent.', userId: newUser.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  };

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findUserByUsername(username);

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.id,
        username: user.username,
        postal_code: user.postal_code  // now included inside user
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

