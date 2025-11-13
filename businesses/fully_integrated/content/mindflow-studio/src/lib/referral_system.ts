import { User } from './user';

interface ReferralEvent {
  referrerId: string;
  referralId: string;
  timestamp: Date;
}

function referralSystem(currentUser: User, newUserReferral: User): void {
  if (!currentUser.isActive || !currentUser.isValidAccount) {
    throw new Error('Current user is not eligible for referral');
  }

  if (!newUserReferral.isValidUser || !newUserReferral.id) {
    throw new Error('New user referral is not a valid user or does not have an ID');
  }

  if (!currentUser.sendWelcomeEmail) {
    throw new Error('Current user does not have the sendWelcomeEmail method');
  }

  if (!newUserReferral.isActive) {
    throw new Error('New user referral is not active');
  }

  currentUser.rewards += 10;
  newUserReferral.sendWelcomeEmail();
  logReferralEvent(currentUser, newUserReferral);
}

function logReferralEvent(referrer: User, referral: User): void {
  if (!referrer.id || !referral.id || !referrer.isValidUser || !referral.isValidUser || !referrer.isActive || !referral.isActive || !referrer.email || !referral.email) {
    throw new Error('One or more users do not have the necessary properties');
  }

  try {
    const referralEvent: ReferralEvent = {
      referrerId: referrer.id,
      referralId: referral.id,
      timestamp: new Date(),
    };

    console.log(JSON.stringify(referralEvent));
  } catch (error) {
    console.error('Error logging referral event:', error);
  }
}

// Add a custom validation function for the User class to check if it's a valid user
function isValidUser(user: User): boolean {
  return user.email.includes('@') && user.password.length > 5 && user.id && user.email && user.password;
}

// Update the User class to include the isValidUser property and the sendWelcomeEmail method
class User {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  isValidAccount: boolean;
  isValidUser: boolean;
  rewards: number;

  constructor(id: string, email: string, password: string, isActive: boolean, isValidAccount: boolean) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.isValidAccount = isValidAccount;
    this.isValidUser = isValidUser(this); // Call the isValidUser function on construction
    this.rewards = 0;
  }

  sendWelcomeEmail(): void {
    // Implement the welcome email sending logic here
    // ...
  }
}

import { User } from './user';

interface ReferralEvent {
  referrerId: string;
  referralId: string;
  timestamp: Date;
}

function referralSystem(currentUser: User, newUserReferral: User): void {
  if (!currentUser.isActive || !currentUser.isValidAccount) {
    throw new Error('Current user is not eligible for referral');
  }

  if (!newUserReferral.isValidUser || !newUserReferral.id) {
    throw new Error('New user referral is not a valid user or does not have an ID');
  }

  if (!currentUser.sendWelcomeEmail) {
    throw new Error('Current user does not have the sendWelcomeEmail method');
  }

  if (!newUserReferral.isActive) {
    throw new Error('New user referral is not active');
  }

  currentUser.rewards += 10;
  newUserReferral.sendWelcomeEmail();
  logReferralEvent(currentUser, newUserReferral);
}

function logReferralEvent(referrer: User, referral: User): void {
  if (!referrer.id || !referral.id || !referrer.isValidUser || !referral.isValidUser || !referrer.isActive || !referral.isActive || !referrer.email || !referral.email) {
    throw new Error('One or more users do not have the necessary properties');
  }

  try {
    const referralEvent: ReferralEvent = {
      referrerId: referrer.id,
      referralId: referral.id,
      timestamp: new Date(),
    };

    console.log(JSON.stringify(referralEvent));
  } catch (error) {
    console.error('Error logging referral event:', error);
  }
}

// Add a custom validation function for the User class to check if it's a valid user
function isValidUser(user: User): boolean {
  return user.email.includes('@') && user.password.length > 5 && user.id && user.email && user.password;
}

// Update the User class to include the isValidUser property and the sendWelcomeEmail method
class User {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  isValidAccount: boolean;
  isValidUser: boolean;
  rewards: number;

  constructor(id: string, email: string, password: string, isActive: boolean, isValidAccount: boolean) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.isValidAccount = isValidAccount;
    this.isValidUser = isValidUser(this); // Call the isValidUser function on construction
    this.rewards = 0;
  }

  sendWelcomeEmail(): void {
    // Implement the welcome email sending logic here
    // ...
  }
}