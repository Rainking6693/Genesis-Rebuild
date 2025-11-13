import { v4 as uuidv4 } from 'uuid';

interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  createdAt: Date;
}

class ReferralSystem {
  private referrals: Referral[] = [];

  public createReferral(referrerId: string, refereeId: string): Referral | null {
    if (!referrerId || !refereeId) {
      throw new Error('Both referrerId and refereeId are required.');
    }

    const referral: Referral = {
      id: uuidv4(),
      referrerId,
      refereeId,
      createdAt: new Date(),
    };

    this.referrals.push(referral);
    return referral;
  }

  public findReferralById(id: string): Referral | undefined {
    const referral = this.referrals.find((referral) => referral.id === id);
    if (!referral) {
      throw new Error(`Referral with id ${id} not found.`);
    }
    return referral;
  }

  public findReferrerById(id: string): Referral[] {
    return this.referrals.filter((referral) => referral.referrerId === id);
  }

  public findRefereeById(id: string): Referral[] {
    return this.referrals.filter((referral) => referral.refereeId === id);
  }

  public findReferralsByReferrerIdAndCreatedAfter(referrerId: string, createdAfter: Date): Referral[] {
    return this.referrals.filter(
      (referral) => referral.referrerId === referrerId && referral.createdAt >= createdAfter
    );
  }

  public findReferralsByRefereeIdAndCreatedBefore(refereeId: string, createdBefore: Date): Referral[] {
    return this.referrals.filter(
      (referral) => referral.refereeId === refereeId && referral.createdAt <= createdBefore
    );
  }

  public updateReferral(id: string, updates: Partial<Referral>): boolean {
    const index = this.referrals.findIndex((referral) => referral.id === id);
    if (index === -1) {
      return false;
    }

    this.referrals[index] = { ...this.referrals[index], ...updates };
    return true;
  }

  public deleteReferral(id: string): boolean {
    const index = this.referrals.findIndex((referral) => referral.id === id);
    if (index === -1) {
      return false;
    }

    this.referrals.splice(index, 1);
    return true;
  }
}

export default ReferralSystem;

import { v4 as uuidv4 } from 'uuid';

interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  createdAt: Date;
}

class ReferralSystem {
  private referrals: Referral[] = [];

  public createReferral(referrerId: string, refereeId: string): Referral | null {
    if (!referrerId || !refereeId) {
      throw new Error('Both referrerId and refereeId are required.');
    }

    const referral: Referral = {
      id: uuidv4(),
      referrerId,
      refereeId,
      createdAt: new Date(),
    };

    this.referrals.push(referral);
    return referral;
  }

  public findReferralById(id: string): Referral | undefined {
    const referral = this.referrals.find((referral) => referral.id === id);
    if (!referral) {
      throw new Error(`Referral with id ${id} not found.`);
    }
    return referral;
  }

  public findReferrerById(id: string): Referral[] {
    return this.referrals.filter((referral) => referral.referrerId === id);
  }

  public findRefereeById(id: string): Referral[] {
    return this.referrals.filter((referral) => referral.refereeId === id);
  }

  public findReferralsByReferrerIdAndCreatedAfter(referrerId: string, createdAfter: Date): Referral[] {
    return this.referrals.filter(
      (referral) => referral.referrerId === referrerId && referral.createdAt >= createdAfter
    );
  }

  public findReferralsByRefereeIdAndCreatedBefore(refereeId: string, createdBefore: Date): Referral[] {
    return this.referrals.filter(
      (referral) => referral.refereeId === refereeId && referral.createdAt <= createdBefore
    );
  }

  public updateReferral(id: string, updates: Partial<Referral>): boolean {
    const index = this.referrals.findIndex((referral) => referral.id === id);
    if (index === -1) {
      return false;
    }

    this.referrals[index] = { ...this.referrals[index], ...updates };
    return true;
  }

  public deleteReferral(id: string): boolean {
    const index = this.referrals.findIndex((referral) => referral.id === id);
    if (index === -1) {
      return false;
    }

    this.referrals.splice(index, 1);
    return true;
  }
}

export default ReferralSystem;