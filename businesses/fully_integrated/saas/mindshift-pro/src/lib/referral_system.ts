import { v4 as uuidv4 } from 'uuid';
import { EncryptionService } from './encryption';

interface User {
  id: string;
  email: string;
  referralCode?: string;
  referrals: string[];
}

class ReferralSystem {
  private users: Map<string, User> = new Map();
  private encryptionService: EncryptionService;

  constructor(encryptionService: EncryptionService) {
    this.encryptionService = encryptionService;
    this.users.set('admin', { id: 'admin', email: 'admin@mindshiftpro.com' });
  }

  public generateReferralCode(userEmail: string): string | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    if (user.referralCode) {
      return new Error('User already has a referral code');
    }

    user.referralCode = uuidv4();
    return user.referralCode;
  }

  public registerReferral(userEmail: string, referrerCode: string): void | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    const referrer = this.users.get(referrerCode);

    if (!referrer) {
      return new Error('Referrer not found');
    }

    if (!user.referralCode) {
      return new Error('User does not have a referral code');
    }

    if (user.referrals.includes(referrerCode)) {
      return new Error('Referral already registered');
    }

    user.referrals.push(referrerCode);
    referrer.referrals.push(user.id);
  }

  public getReferralRewards(userEmail: string): void | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    // Implement reward logic here, such as granting access to premium features or providing discounts.
  }

  public validateReferralCode(referralCode: string): boolean {
    const user = this.users.get(referralCode);

    return !!user;
  }

  public encryptReferralCode(referralCode: string): string | Error {
    if (!referralCode) {
      throw new Error('Referral code cannot be empty');
    }

    const encryptedCode = this.encryptionService.encrypt(referralCode);
    if (!encryptedCode) {
      return new Error('Encryption failed');
    }

    return encryptedCode;
  }

  public decryptReferralCode(encryptedCode: string): string | Error {
    const decryptedCode = this.encryptionService.decrypt(encryptedCode);

    if (!decryptedCode) {
      return new Error('Decryption failed or invalid encrypted code');
    }

    return decryptedCode;
  }
}

export interface EncryptionService {
  encrypt(data: string): string | null;
  decrypt(data: string): string | null;
}

export const referralSystem = new ReferralSystem(new EncryptionService());

import { v4 as uuidv4 } from 'uuid';
import { EncryptionService } from './encryption';

interface User {
  id: string;
  email: string;
  referralCode?: string;
  referrals: string[];
}

class ReferralSystem {
  private users: Map<string, User> = new Map();
  private encryptionService: EncryptionService;

  constructor(encryptionService: EncryptionService) {
    this.encryptionService = encryptionService;
    this.users.set('admin', { id: 'admin', email: 'admin@mindshiftpro.com' });
  }

  public generateReferralCode(userEmail: string): string | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    if (user.referralCode) {
      return new Error('User already has a referral code');
    }

    user.referralCode = uuidv4();
    return user.referralCode;
  }

  public registerReferral(userEmail: string, referrerCode: string): void | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    const referrer = this.users.get(referrerCode);

    if (!referrer) {
      return new Error('Referrer not found');
    }

    if (!user.referralCode) {
      return new Error('User does not have a referral code');
    }

    if (user.referrals.includes(referrerCode)) {
      return new Error('Referral already registered');
    }

    user.referrals.push(referrerCode);
    referrer.referrals.push(user.id);
  }

  public getReferralRewards(userEmail: string): void | Error {
    const user = this.users.get(userEmail);

    if (!user) {
      return new Error('User not found');
    }

    // Implement reward logic here, such as granting access to premium features or providing discounts.
  }

  public validateReferralCode(referralCode: string): boolean {
    const user = this.users.get(referralCode);

    return !!user;
  }

  public encryptReferralCode(referralCode: string): string | Error {
    if (!referralCode) {
      throw new Error('Referral code cannot be empty');
    }

    const encryptedCode = this.encryptionService.encrypt(referralCode);
    if (!encryptedCode) {
      return new Error('Encryption failed');
    }

    return encryptedCode;
  }

  public decryptReferralCode(encryptedCode: string): string | Error {
    const decryptedCode = this.encryptionService.decrypt(encryptedCode);

    if (!decryptedCode) {
      return new Error('Decryption failed or invalid encrypted code');
    }

    return decryptedCode;
  }
}

export interface EncryptionService {
  encrypt(data: string): string | null;
  decrypt(data: string): string | null;
}

export const referralSystem = new ReferralSystem(new EncryptionService());