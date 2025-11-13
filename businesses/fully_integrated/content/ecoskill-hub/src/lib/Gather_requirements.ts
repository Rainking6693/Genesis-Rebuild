import { v4 as uuidv4 } from 'uuid';
import { validate, sanitize } from './inputValidation';
import bcrypt from 'bcrypt';

interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  experience: number;
  certifications: string[];
  password?: string; // Adding password field for future use
}

interface ValidatedUser extends User {
  valid: boolean;
}

function validateUserInput(user: User): ValidatedUser {
  const { name, email, skills, interests, experience, certifications } = user;

  // Check if email is valid
  const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  if (!isValidEmail) {
    return { ...user, valid: false };
  }

  // Check if skills and interests are non-empty arrays
  if (!Array.isArray(skills) || skills.length === 0) {
    return { ...user, valid: false };
  }
  if (!Array.isArray(interests) || interests.length === 0) {
    return { ...user, valid: false };
  }

  return { ...user, valid: true };
}

function sanitizeUserData(user: User): User {
  const { name, email, skills, interests, experience, certifications } = user;

  // Remove any unwanted characters from the user's name, email, etc.
  const sanitizedName = sanitize(name);
  const sanitizedEmail = sanitize(email);

  return {
    ...user,
    name: sanitizedName,
    email: sanitizedEmail,
    skills: skills.map(skill => sanitize(skill)),
    interests: interests.map(interest => sanitize(interest))
  };
}

function addUser(name: string, email: string, skills: string[], interests: string[], experience: number, certifications: string[]): User {
  const user: User = {
    id: uuidv4(),
    name,
    email,
    skills,
    interests,
    experience,
    certifications
  };

  // Validate user input
  const validatedUser = validateUserInput(user);
  if (!validatedUser.valid) {
    throw new Error('Invalid user input');
  }

  // Sanitize data
  const sanitizedUser = sanitizeUserData(validatedUser);

  // Use secure hashing for passwords (if password is provided)
  if (sanitizedUser.password) {
    sanitizedUser.password = await bcrypt.hash(sanitizedUser.password, 10);
  }

  return sanitizedUser;
}

// Adding a function to check if the email is already in use
async function isEmailAlreadyInUse(email: string): Promise<boolean> {
  // Implement database query to check if the email exists in the users table
  // Return true if the email exists, false otherwise
}

// Adding a function to handle errors when adding a user
async function handleAddUserError(error: Error): Promise<void> {
  // Implement error handling logic, such as logging the error, sending an error response, etc.
}

import { v4 as uuidv4 } from 'uuid';
import { validate, sanitize } from './inputValidation';
import bcrypt from 'bcrypt';

interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  experience: number;
  certifications: string[];
  password?: string; // Adding password field for future use
}

interface ValidatedUser extends User {
  valid: boolean;
}

function validateUserInput(user: User): ValidatedUser {
  const { name, email, skills, interests, experience, certifications } = user;

  // Check if email is valid
  const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  if (!isValidEmail) {
    return { ...user, valid: false };
  }

  // Check if skills and interests are non-empty arrays
  if (!Array.isArray(skills) || skills.length === 0) {
    return { ...user, valid: false };
  }
  if (!Array.isArray(interests) || interests.length === 0) {
    return { ...user, valid: false };
  }

  return { ...user, valid: true };
}

function sanitizeUserData(user: User): User {
  const { name, email, skills, interests, experience, certifications } = user;

  // Remove any unwanted characters from the user's name, email, etc.
  const sanitizedName = sanitize(name);
  const sanitizedEmail = sanitize(email);

  return {
    ...user,
    name: sanitizedName,
    email: sanitizedEmail,
    skills: skills.map(skill => sanitize(skill)),
    interests: interests.map(interest => sanitize(interest))
  };
}

function addUser(name: string, email: string, skills: string[], interests: string[], experience: number, certifications: string[]): User {
  const user: User = {
    id: uuidv4(),
    name,
    email,
    skills,
    interests,
    experience,
    certifications
  };

  // Validate user input
  const validatedUser = validateUserInput(user);
  if (!validatedUser.valid) {
    throw new Error('Invalid user input');
  }

  // Sanitize data
  const sanitizedUser = sanitizeUserData(validatedUser);

  // Use secure hashing for passwords (if password is provided)
  if (sanitizedUser.password) {
    sanitizedUser.password = await bcrypt.hash(sanitizedUser.password, 10);
  }

  return sanitizedUser;
}

// Adding a function to check if the email is already in use
async function isEmailAlreadyInUse(email: string): Promise<boolean> {
  // Implement database query to check if the email exists in the users table
  // Return true if the email exists, false otherwise
}

// Adding a function to handle errors when adding a user
async function handleAddUserError(error: Error): Promise<void> {
  // Implement error handling logic, such as logging the error, sending an error response, etc.
}