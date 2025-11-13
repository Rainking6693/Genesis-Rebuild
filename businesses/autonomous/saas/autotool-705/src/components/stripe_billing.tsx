// src/components/StripeBilling.tsx
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface SubscriptionData {
  priceId: string;
  customerId: string;
}

interface WebhookEvent {
  type: string;
  data: {
    object: any; // Adjust type as needed based on event type
  };
}

export const createSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: subscriptionData.customerId,
      items: [{ price: subscriptionData.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

export const handleWebhook = async (rawBody: string, signature: string, stripeWebhookSecret: string) => {
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret) as WebhookEvent;

    switch (event.type) {
      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data.object);
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellations
        console.log('Subscription deleted:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
};

export const getCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
};

// Example usage (can be removed or placed in a separate file)
// async function exampleUsage() {
//   try {
//     // Create a subscription
//     const subscriptionResult = await createSubscription({
//       priceId: 'price_123', // Replace with your actual price ID
//       customerId: 'cus_123', // Replace with your actual customer ID
//     });
//     console.log('Subscription created:', subscriptionResult);

//     // Get a customer portal session
//     const portalUrl = await getCustomerPortalSession('cus_123', 'https://example.com/return'); // Replace with your actual customer ID and return URL
//     console.log('Customer portal URL:', portalUrl);
//   } catch (error: any) {
//     console.error('Error during example usage:', error);
//   }
// }

// exampleUsage();

// Total: ~150 lines of TypeScript

// src/components/StripeBilling.tsx
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

interface SubscriptionData {
  priceId: string;
  customerId: string;
}

interface WebhookEvent {
  type: string;
  data: {
    object: any; // Adjust type as needed based on event type
  };
}

export const createSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: subscriptionData.customerId,
      items: [{ price: subscriptionData.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

export const handleWebhook = async (rawBody: string, signature: string, stripeWebhookSecret: string) => {
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret) as WebhookEvent;

    switch (event.type) {
      case 'invoice.payment_succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', event.data.object);
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellations
        console.log('Subscription deleted:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
};

export const getCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
};

// Example usage (can be removed or placed in a separate file)
// async function exampleUsage() {
//   try {
//     // Create a subscription
//     const subscriptionResult = await createSubscription({
//       priceId: 'price_123', // Replace with your actual price ID
//       customerId: 'cus_123', // Replace with your actual customer ID
//     });
//     console.log('Subscription created:', subscriptionResult);

//     // Get a customer portal session
//     const portalUrl = await getCustomerPortalSession('cus_123', 'https://example.com/return'); // Replace with your actual customer ID and return URL
//     console.log('Customer portal URL:', portalUrl);
//   } catch (error: any) {
//     console.error('Error during example usage:', error);
//   }
// }

// exampleUsage();

// Total: ~150 lines of TypeScript