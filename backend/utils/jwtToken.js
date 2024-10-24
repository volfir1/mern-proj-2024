// utils/jwtToken.js
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

export default generateToken;