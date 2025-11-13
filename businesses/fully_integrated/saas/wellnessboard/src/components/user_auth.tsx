function addNumbers(num1: number, num2: number): number {
  return num1 + num2;
}

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = [
  { id: 1, username: 'user1', password: '$2a$10$Q8F2T6i3b6oZjRq8nXL9Se99Kd9nHc0.JLRcKk16P4Gn6E' }, // Hashed password
  { id: 2, username: 'user2', password: '$2a$10$Q8F2T6i3b6oZjRq8nXL9Se99Kd9nHc0.JLRcKk16P4Gn6E' }, // Hashed password
];

const saltRounds = 10;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized.' });
  }
};

function addNumbers(num1: number, num2: number): number {
  return num1 + num2;
}

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = [
  { id: 1, username: 'user1', password: '$2a$10$Q8F2T6i3b6oZjRq8nXL9Se99Kd9nHc0.JLRcKk16P4Gn6E' }, // Hashed password
  { id: 2, username: 'user2', password: '$2a$10$Q8F2T6i3b6oZjRq8nXL9Se99Kd9nHc0.JLRcKk16P4Gn6E' }, // Hashed password
];

const saltRounds = 10;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized.' });
  }
};

Now, let's focus on the user_auth component. Here's a TypeScript example for a simplified user authentication service: