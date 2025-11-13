import stripe from 'stripe';

type User = {
  email: string;
  name: string;
};

type Plan = {
  id: string;
};

type Coupon = {
  id: string;
  status: stripe.Coupon['status']; // Add status to Coupon type
};

const stripe = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27', // Use a specific API version
  maxNetworkRetries: 3, // Set max network retries for resiliency
});

async function createCustomer(user: User): Promise<stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      description: 'EcoBox Builder Subscriber',
    });

    return customer;
  } catch (error) {
    console.error(`Error creating customer: ${error.message}`);
    throw error;
  }
}

async function retrieveCoupon(couponCode: string): Promise<Coupon | null> {
  try {
    const coupon = await stripe.coupons.retrieve(couponCode);

    if (coupon.status !== 'active') {
      console.error(`Coupon code ${couponCode} is invalid or expired.`);
      return null;
    }

    return coupon;
  } catch (error) {
    console.error(`Error retrieving coupon: ${error.message}`);
    return null;
  }
}

async function createSubscription(
  user: User,
  planId: string,
  couponCode?: string
): Promise<stripe.Customer & stripe.Subscription> {
  const customer = await createCustomer(user);

  let subscription: stripe.Subscription | null = null;

  if (couponCode) {
    const coupon = await retrieveCoupon(couponCode);

    if (coupon) {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: planId }],
        coupon: coupon.id,
      });
    } else {
      console.error('Invalid or expired coupon code.');
    }
  }

  if (!subscription) {
    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId }],
    });
  }

  return Object.assign(customer, subscription);
}