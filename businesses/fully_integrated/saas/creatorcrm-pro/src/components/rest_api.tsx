import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Database } from './Database';

dotenv.config();
const router = express.Router();

interface RequestBody {
  username: string;
  password: string;
}

const minPasswordLength = 8;
const minUsernameLength = 3;

// Custom validation for password length
const validatePasswordLength = (value: string) => {
  if (value.length < minPasswordLength) {
    throw new Error('Password must be at least 8 characters long');
  }
  return true;
};

// Custom validation for username length
const validateUsernameLength = (value: string) => {
  if (value.length < minUsernameLength) {
    throw new Error('Username must be at least 3 characters long');
  }
  return true;
};

router.post('/login', [
  body('username').custom(validateUsernameLength),
  body('password').custom(validatePasswordLength),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await new Database().findUserByUsername(req.body.username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });

  res.json({ token });
});

export default router;

Changes made:

1. Extracted custom validation functions for password and username length to improve readability and maintainability.
2. Added error responses for edge cases like user not found.
3. Used the `new Database()` syntax to create a new instance of the Database class.
4. Improved accessibility by adding more descriptive error messages.
5. Added a minimum username length of 3 characters.