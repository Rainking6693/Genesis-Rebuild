import { expect } from 'chai';
import sinon from 'sinon';
import { validateSubscription } from './subscriptionValidator';

describe('validateSubscription', () => {
  let validateSubscriptionSpy;

  beforeEach(() => {
    validateSubscriptionSpy = sinon.spy(validateSubscription, 'validateSubscription');
  });

  afterEach(() => {
    validateSubscriptionSpy.restore();
  });

  it('should return an error if the subscription object is null or undefined', () => {
    const result = validateSubscription(null);
    expect(result).to.deep.equal({ error: 'Subscription object is required.' });

    const result2 = validateSubscription(undefined);
    expect(result2).to.deep.equal({ error: 'Subscription object is required.' });
  });

  it('should return an error if the subscription object does not have required properties', () => {
    const subscription = { id: 1 };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({
      error: 'Subscription object must have the following properties: customerId, planId, status, startDate, endDate.'
    });
  });

  it('should return an error if the customerId is not a string', () => {
    const subscription = {
      customerId: 1,
      planId: 'basic',
      status: 'active',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'customerId must be a string.' });
  });

  it('should return an error if the planId is not a string', () => {
    const subscription = {
      customerId: '123',
      planId: 1,
      status: 'active',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'planId must be a string.' });
  });

  it('should return an error if the status is not a valid status', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'invalid',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'status must be one of: active, cancelled, pending.' });
  });

  it('should return an error if the startDate is not a Date object', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: '2022-01-01',
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'startDate must be a Date object.' });
  });

  it('should return an error if the endDate is not a Date object', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date(),
      endDate: '2022-01-01'
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'endDate must be a Date object.' });
  });

  it('should return an error if the endDate is before the startDate', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2021-12-31')
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'endDate must be after startDate.' });
  });

  it('should call the validateSubscription function with the correct arguments', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-12-31')
    };
    validateSubscription(subscription);
    expect(validateSubscriptionSpy.calledOnce).to.be.true;
    expect(validateSubscriptionSpy.args[0][0]).to.deep.equal(subscription);
  });

  it('should return a valid result if the subscription object is valid', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-12-31')
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ valid: true });
  });
});

import { expect } from 'chai';
import sinon from 'sinon';
import { validateSubscription } from './subscriptionValidator';

describe('validateSubscription', () => {
  let validateSubscriptionSpy;

  beforeEach(() => {
    validateSubscriptionSpy = sinon.spy(validateSubscription, 'validateSubscription');
  });

  afterEach(() => {
    validateSubscriptionSpy.restore();
  });

  it('should return an error if the subscription object is null or undefined', () => {
    const result = validateSubscription(null);
    expect(result).to.deep.equal({ error: 'Subscription object is required.' });

    const result2 = validateSubscription(undefined);
    expect(result2).to.deep.equal({ error: 'Subscription object is required.' });
  });

  it('should return an error if the subscription object does not have required properties', () => {
    const subscription = { id: 1 };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({
      error: 'Subscription object must have the following properties: customerId, planId, status, startDate, endDate.'
    });
  });

  it('should return an error if the customerId is not a string', () => {
    const subscription = {
      customerId: 1,
      planId: 'basic',
      status: 'active',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'customerId must be a string.' });
  });

  it('should return an error if the planId is not a string', () => {
    const subscription = {
      customerId: '123',
      planId: 1,
      status: 'active',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'planId must be a string.' });
  });

  it('should return an error if the status is not a valid status', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'invalid',
      startDate: new Date(),
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'status must be one of: active, cancelled, pending.' });
  });

  it('should return an error if the startDate is not a Date object', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: '2022-01-01',
      endDate: new Date()
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'startDate must be a Date object.' });
  });

  it('should return an error if the endDate is not a Date object', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date(),
      endDate: '2022-01-01'
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'endDate must be a Date object.' });
  });

  it('should return an error if the endDate is before the startDate', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2021-12-31')
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ error: 'endDate must be after startDate.' });
  });

  it('should call the validateSubscription function with the correct arguments', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-12-31')
    };
    validateSubscription(subscription);
    expect(validateSubscriptionSpy.calledOnce).to.be.true;
    expect(validateSubscriptionSpy.args[0][0]).to.deep.equal(subscription);
  });

  it('should return a valid result if the subscription object is valid', () => {
    const subscription = {
      customerId: '123',
      planId: 'basic',
      status: 'active',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-12-31')
    };
    const result = validateSubscription(subscription);
    expect(result).to.deep.equal({ valid: true });
  });
});