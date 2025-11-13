import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { promisify } from 'util';
import { createToken, logout } from '../utils/token';
import { sanitizeUser } from './sanitizeUser';
import { validateRequest } from 'express-validator';

const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // ... existing code ...
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // ... existing code ...
});

const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // ... existing code ...
});

const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', '', { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ status: 'success' });
});

export const authController = {
  signup,
  login,
  protect,
  logout,
};

// Add sanitizeUser function to sanitize the user object before sending it as a response
function sanitizeUser(user: IUser) {
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
}

// Handle validation errors from the Express validator
function handleValidationError(err: any, req: Request, res: Response, next: NextFunction) {
  const errors = Object.values(err.errors).map((error) => error.msg);
  res.status(400).json({ errors });
}

// Validate input data using the Express validator
const validateSignup = validateRequest([
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').notEmpty(),
]);

const validateLogin = validateRequest([
  body('username').notEmpty(),
  body('password').notEmpty(),
]);

export { validateSignup, validateLogin, handleValidationError, restrictTo };

In this updated code, I've added the `logout` function, the `restrictTo` function to restrict access to certain routes, the `handleValidationError` function to handle validation errors from the Express validator, and the `validateSignup` and `validateLogin` functions to validate input data using the Express validator.