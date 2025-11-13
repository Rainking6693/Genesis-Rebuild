import { v4 as uuidv4 } from 'uuid';
import { encrypt, decrypt } from './encryption';

type ReferralId = string;
type ReferrerId = string;
type RefereeId = string;
type CreatedAt = Date;
type Status = 'pending' | 'approved' | 'rejected';

type Referral = {
  id: ReferralId;
  referrerId: ReferrerId;
  refereeId: RefereeId;
  createdAt: CreatedAt;
  status: Status;
};

class ReferralSystem {
  private referrals: Referral[] = [];

  public createReferral(referrerId: ReferrerId, refereeId: RefereeId): Referral {
    const referral: Referral = {
      id: uuidv4(),
      referrerId,
      refereeId,
      createdAt: new Date(),
      status: 'pending',
    };

    this.referrals.push(referral);
    return referral;
  }

  public approveReferral(referralId: ReferralId): void {
    const referralIndex = this.referrals.findIndex((referral) => referral.id === referralId);

    if (referralIndex !== -1) {
      this.referrals[referralIndex].status = 'approved';
    } else {
      throw new Error(`Referral with ID ${referralId} not found.`);
    }
  }

  public rejectReferral(referralId: ReferralId): void {
    const referralIndex = this.referrals.findIndex((referral) => referral.id === referralId);

    if (referralIndex !== -1) {
      this.referrals[referralIndex].status = 'rejected';
    } else {
      throw new Error(`Referral with ID ${referralId} not found.`);
    }
  }

  public getReferralStatus(referralId: ReferralId): Referral | null {
    return this.referrals.find((referral) => referral.id === referralId);
  }

  public encryptReferralData(referral: Referral): Referral {
    try {
      const encryptedReferral: Referral = {
        ...referral,
        referrerId: encrypt(referral.referrerId),
        refereeId: encrypt(referral.refereeId),
      };

      return encryptedReferral;
    } catch (error) {
      throw new Error(`Error encrypting referral data: ${error.message}`);
    }
  }

  public decryptReferralData(referral: Referral): Referral {
    try {
      const decryptedReferral: Referral = {
        ...referral,
        referrerId: decrypt(referral.referrerId),
        refereeId: decrypt(referral.refereeId),
      };

      return decryptedReferral;
    } catch (error) {
      throw new Error(`Error decrypting referral data: ${error.message}`);
    }
  }

  public validateReferrerId(referrerId: ReferrerId): void {
    if (!referrerId || typeof referrerId !== 'string') {
      throw new Error('Invalid referrerId. It should be a non-empty string.');
    }
  }

  public validateRefereeId(refereeId: RefereeId): void {
    if (!refereeId || typeof refereeId !== 'string') {
      throw new Error('Invalid refereeId. It should be a non-empty string.');
    }
  }

  public validateReferralId(referralId: ReferralId): void {
    if (!referralId || typeof referralId !== 'string') {
      throw new Error('Invalid referralId. It should be a non-empty string.');
    }
  }
}

export { ReferralSystem };

In this version, I've added type annotations for ReferralId, ReferrerId, RefereeId, CreatedAt, and Status. I've also added a `validateReferralId` method to ensure that the provided referralId is a non-empty string. This helps with maintainability and readability.