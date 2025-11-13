import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserCreationAttributes } from '../models/User';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function name: validateEmail
// Description: Validates email format
function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Function name: validateUserCredentials
// Description: Validates user credentials for authentication
// Throws an error if user not found or password is incorrect
async function validateUserCredentials(email: string, password: string): Promise<User> {
  // Fetch user from database by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  // Compare provided password with hashed password in database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Incorrect password');
  }

  return user; // Valid credentials
}

// Function name: createUser
// Description: Creates a new user and hashes the password before saving
// Returns the created user
async function createUser(email: string, password: string): Promise<User> {
  // Validate email
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Hash the password with salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user with the hashed password
  const newUser: UserCreationAttributes = { email, password: hashedPassword };
  const createdUser = await User.create(newUser);

  // Send confirmation email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: createdUser.email,
    subject: 'Confirm your email address',
    text: `Please confirm your email address by clicking this link: http://localhost:3000/confirm/${createdUser.id}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  return createdUser;
}

// Function name: getUserById
// Description: Retrieves a user by id
async function getUserById(id: number): Promise<User | null> {
  return User.findByPk(id);
}

// Function name: updateUserPassword
// Description: Updates a user's password
async function updateUserPassword(id: number, password: string): Promise<void> {
  const user = await getUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  // Hash the password with salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await user.update({ password: hashedPassword });
}

// Function name: deleteUser
// Description: Deletes a user
async function deleteUser(id: number): Promise<void> {
  const user = await getUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
}

// Function name: checkUserExists
// Description: Checks if a user exists
async function checkUserExists(email: string): Promise<boolean> {
  const user = await User.findOne({ where: { email } });

  return !!user;
}

// Function name: validateRegistrationCredentials
// Description: Validates email and password for registration
function validateRegistrationCredentials(email: string, password: string): boolean {
  // Validate email
  if (!validateEmail(email)) {
    return false;
  }

  // Check if email already exists
  if (checkUserExists(email)) {
    return false;
  }

  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  return true;
}

// Function name: confirmEmail
// Description: Confirms email address
async function confirmEmail(token: string): Promise<void> {
  // Find user by confirmation token
  const user = await User.findOne({ where: { confirmationToken: token } });

  if (!user) {
    throw new Error('User not found');
  }

  // Update user's isConfirmed field to true
  await user.update({ isConfirmed: true });

  // Remove confirmation token
  await user.update({ confirmationToken: null });
}

// Function name: resetPassword
// Description: Resets a user's password
async function resetPassword(email: string, newPassword: string): Promise<void> {
  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  // Hash the new password with salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user's password
  await user.update({ password: hashedPassword });
}

// Function name: validatePasswordResetToken
// Description: Validates token for password reset
function validatePasswordResetToken(token: string): boolean {
  // Check if token is a valid UUID
  return uuidv4().toString() === token;
}

// Function name: updateUserProfile
// Description: Updates a user's profile
async function updateUserProfile(id: number, firstName: string, lastName: string): Promise<void> {
  const user = await getUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  await user.update({ firstName, lastName });
}

// Function name: deleteUserAccount
// Description: Deletes a user's account
async function deleteUserAccount(id: number): Promise<void> {
  const user = await getUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
}

export {
  validateEmail,
  validateUserCredentials,
  createUser,
  getUserById,
  updateUserPassword,
  deleteUser,
  checkUserExists,
  validateRegistrationCredentials,
  confirmEmail,
  resetPassword,
  validatePasswordResetToken,
  updateUserProfile,
  deleteUserAccount,
};