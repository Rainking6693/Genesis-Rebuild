import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserInputError, AuthenticationError } from 'apollo-server-errors';

interface User {
  id: string;
  username: string;
  password: string;
}

interface AuthData {
  username: string;
  password: string;
}

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function generateToken(user: User): string {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

async function authenticate(authData: AuthData, users: User[]): Promise<User | null> {
  const user = users.find((u) => u.username === authData.username);

  if (!user) {
    throw new UserInputError('Invalid username or password');
  }

  const isValidPassword = await bcrypt.compare(authData.password, user.password);

  if (!isValidPassword) {
    throw new UserInputError('Invalid username or password');
  }

  return user;
}

function getUserFromToken(authorization: string): User | null {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization token missing or invalid');
  }

  try {
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, username: decoded.username };
  } catch (error) {
    throw new AuthenticationError('Authorization token expired or invalid');
  }
}

export const userAuth = {
  async register(parent, args, context, info) {
    const hashedPassword = await hashPassword(args.password);
    context.users.push({ id: context.users.length.toString(), username: args.username, password: hashedPassword });
    return { username: args.username };
  },

  async login(parent, args, context, info) {
    const user = await authenticate(args, context.users);
    const token = generateToken(user);
    return { token };
  },

  async protect(parent, args, context, info, next) {
    const authorization = context.req.headers.authorization;
    const user = getUserFromToken(authorization);

    if (!user) {
      throw new AuthenticationError('Authorization required');
    }

    context.user = user;
    await next();
  },

  async requireUser(parent, args, context, info, next) {
    if (!context.user) {
      throw new AuthenticationError('User not authenticated');
    }

    await next();
  },
};

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserInputError, AuthenticationError } from 'apollo-server-errors';

interface User {
  id: string;
  username: string;
  password: string;
}

interface AuthData {
  username: string;
  password: string;
}

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function generateToken(user: User): string {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

async function authenticate(authData: AuthData, users: User[]): Promise<User | null> {
  const user = users.find((u) => u.username === authData.username);

  if (!user) {
    throw new UserInputError('Invalid username or password');
  }

  const isValidPassword = await bcrypt.compare(authData.password, user.password);

  if (!isValidPassword) {
    throw new UserInputError('Invalid username or password');
  }

  return user;
}

function getUserFromToken(authorization: string): User | null {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authorization token missing or invalid');
  }

  try {
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, username: decoded.username };
  } catch (error) {
    throw new AuthenticationError('Authorization token expired or invalid');
  }
}

export const userAuth = {
  async register(parent, args, context, info) {
    const hashedPassword = await hashPassword(args.password);
    context.users.push({ id: context.users.length.toString(), username: args.username, password: hashedPassword });
    return { username: args.username };
  },

  async login(parent, args, context, info) {
    const user = await authenticate(args, context.users);
    const token = generateToken(user);
    return { token };
  },

  async protect(parent, args, context, info, next) {
    const authorization = context.req.headers.authorization;
    const user = getUserFromToken(authorization);

    if (!user) {
      throw new AuthenticationError('Authorization required');
    }

    context.user = user;
    await next();
  },

  async requireUser(parent, args, context, info, next) {
    if (!context.user) {
      throw new AuthenticationError('User not authenticated');
    }

    await next();
  },
};