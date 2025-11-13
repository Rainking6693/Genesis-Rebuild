import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';

type User = {
  id: string;
  name: string;
  email: string;
  referralCode?: string | null;
  referrals: number;
};

class ReferralSystem {
  private users: Map<string, User> = new Map();

  public addUser(name: string, email: string): string {
    const user: User = { id: uuidv4(), name, email, referralCode: null, referrals: 0 };
    this.users.set(user.id, user);
    return user.id;
  }

  public generateReferralCode(userId: string): string | null {
    let referralCode: string | null = null;

    do {
      referralCode = Math.random().toString(36).substring(2, 15);
    } while (this.users.has(referralCode) || !referralCode); // Check if the generated code already exists or is empty

    if (referralCode) {
      const encryptedCode = encrypt(referralCode);
      this.users.get(userId)!.referralCode = encryptedCode;
    }

    return referralCode;
  }

  public redeemReferralCode(userId: string, referralCode: string): void {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.referralCode) {
      throw new Error('User has no referral code');
    }

    const decryptedCode = decrypt(user.referralCode);

    if (!decryptedCode || decryptedCode !== referralCode) {
      throw new Error('Invalid referral code');
    }

    user.referrals++;
    user.referralCode = null;
  }

  public getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  public deleteUser(userId: string): void {
    this.users.delete(userId);
  }

  public updateUser(userId: string, updates: Partial<User>): void {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates);
  }
}

export { ReferralSystem };

import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';

type User = {
  id: string;
  name: string;
  email: string;
  referralCode?: string | null;
  referrals: number;
};

class ReferralSystem {
  private users: Map<string, User> = new Map();

  public addUser(name: string, email: string): string {
    const user: User = { id: uuidv4(), name, email, referralCode: null, referrals: 0 };
    this.users.set(user.id, user);
    return user.id;
  }

  public generateReferralCode(userId: string): string | null {
    let referralCode: string | null = null;

    do {
      referralCode = Math.random().toString(36).substring(2, 15);
    } while (this.users.has(referralCode) || !referralCode); // Check if the generated code already exists or is empty

    if (referralCode) {
      const encryptedCode = encrypt(referralCode);
      this.users.get(userId)!.referralCode = encryptedCode;
    }

    return referralCode;
  }

  public redeemReferralCode(userId: string, referralCode: string): void {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.referralCode) {
      throw new Error('User has no referral code');
    }

    const decryptedCode = decrypt(user.referralCode);

    if (!decryptedCode || decryptedCode !== referralCode) {
      throw new Error('Invalid referral code');
    }

    user.referrals++;
    user.referralCode = null;
  }

  public getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  public deleteUser(userId: string): void {
    this.users.delete(userId);
  }

  public updateUser(userId: string, updates: Partial<User>): void {
    const user = this.users.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates);
  }
}

export { ReferralSystem };