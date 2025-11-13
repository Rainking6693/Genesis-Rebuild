// calculateTotal.ts

export function calculateTotal(users: number, plan: string): number {
  const pricingPlans = {
    basic: {
      costPerUser: 5,
      maxUsers: 100,
    },
    pro: {
      costPerUser: 10,
      maxUsers: 500,
    },
    enterprise: {
      costPerUser: 20,
      maxUsers: 1000,
    },
  };

  const planData = pricingPlans[plan];

  if (!planData) {
    throw new Error(`Invalid pricing plan: ${plan}`);
  }

  if (users > planData.maxUsers) {
    throw new Error(`Too many users for plan ${plan}: ${users}`);
  }

  return users * planData.costPerUser;
}

// calculateTotal.test.ts

import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should calculate total cost correctly for basic plan', () => {
    expect(calculateTotal(10, 'basic')).toBe(50);
    expect(calculateTotal(50, 'basic')).toBe(250);
  });

  it('should calculate total cost correctly for pro plan', () => {
    expect(calculateTotal(101, 'pro')).toThrowError(
      'Too many users for plan pro: 101'
    );
    expect(calculateTotal(100, 'pro')).toBe(1000);
    expect(calculateTotal(499, 'pro')).toBe(4990);
  });

  it('should calculate total cost correctly for enterprise plan', () => {
    expect(calculateTotal(1001, 'enterprise')).toThrowError(
      'Too many users for plan enterprise: 1001'
    );
    expect(calculateTotal(1000, 'enterprise')).toBe(20000);
    expect(calculateTotal(999, 'enterprise')).toBe(19970);
  });

  it('should throw an error for invalid pricing plan', () => {
    expect(() => calculateTotal(10, 'invalid')).toThrowError(
      'Invalid pricing plan: invalid'
    );
  });

  it('should be accessible', () => {
    expect(calculateTotal).toHaveLength(1);
    expect(calculateTotal).toBeInstanceOf(Function);
  });
});

// calculateTotal.ts

export function calculateTotal(users: number, plan: string): number {
  const pricingPlans = {
    basic: {
      costPerUser: 5,
      maxUsers: 100,
    },
    pro: {
      costPerUser: 10,
      maxUsers: 500,
    },
    enterprise: {
      costPerUser: 20,
      maxUsers: 1000,
    },
  };

  const planData = pricingPlans[plan];

  if (!planData) {
    throw new Error(`Invalid pricing plan: ${plan}`);
  }

  if (users > planData.maxUsers) {
    throw new Error(`Too many users for plan ${plan}: ${users}`);
  }

  return users * planData.costPerUser;
}

// calculateTotal.test.ts

import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should calculate total cost correctly for basic plan', () => {
    expect(calculateTotal(10, 'basic')).toBe(50);
    expect(calculateTotal(50, 'basic')).toBe(250);
  });

  it('should calculate total cost correctly for pro plan', () => {
    expect(calculateTotal(101, 'pro')).toThrowError(
      'Too many users for plan pro: 101'
    );
    expect(calculateTotal(100, 'pro')).toBe(1000);
    expect(calculateTotal(499, 'pro')).toBe(4990);
  });

  it('should calculate total cost correctly for enterprise plan', () => {
    expect(calculateTotal(1001, 'enterprise')).toThrowError(
      'Too many users for plan enterprise: 1001'
    );
    expect(calculateTotal(1000, 'enterprise')).toBe(20000);
    expect(calculateTotal(999, 'enterprise')).toBe(19970);
  });

  it('should throw an error for invalid pricing plan', () => {
    expect(() => calculateTotal(10, 'invalid')).toThrowError(
      'Invalid pricing plan: invalid'
    );
  });

  it('should be accessible', () => {
    expect(calculateTotal).toHaveLength(1);
    expect(calculateTotal).toBeInstanceOf(Function);
  });
});

Now, let's write the test function: