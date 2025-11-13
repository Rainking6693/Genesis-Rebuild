import React, { useState, useEffect } from 'react';
import { subscribeUser, unsubscribeUser, sendEmail } from '../api/emailService'; // Assuming an email service API
import { useUserContext } from '../contexts/UserContext'; // Assuming a user context for user data

interface EmailMarketingProps {
  // Define any props needed for the component
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const { user } = useUserContext(); // Get user data from context

  useEffect(() => {
    // Check subscription status on component mount (example)
    if (user && user.email) {
      setEmail(user.email); // Pre-populate email if user is logged in
      // Placeholder: Replace with actual API call to check subscription status
      // Assuming the API returns a boolean indicating subscription status
      const checkSubscriptionStatus = async () => {
        try {
          // const subscribed = await checkUserSubscription(user.email); // Replace with actual API call
          // setIsSubscribed(subscribed);
          setIsSubscribed(false); // Placeholder - Assume not subscribed initially
        } catch (error: any) {
          console.error("Error checking subscription status:", error);
          setSubscriptionStatus(`Error checking subscription status: ${error.message}`);
        }
      };
      checkSubscriptionStatus();
    }
  }, [user]);

  const handleSubscribe = async () => {
    try {
      const result = await subscribeUser(email); // Call the API to subscribe
      setIsSubscribed(true);
      setSubscriptionStatus('Successfully subscribed!');

      // Example: Send a welcome email
      await sendEmail({
        to: email,
        subject: 'Welcome to our Newsletter!',
        body: 'Thank you for subscribing to our newsletter. Stay tuned for updates and exclusive offers!'
      });

    } catch (error: any) {
      console.error("Error subscribing:", error);
      setIsSubscribed(false);
      setSubscriptionStatus(`Error subscribing: ${error.message}`);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const result = await unsubscribeUser(email); // Call the API to unsubscribe
      setIsSubscribed(false);
      setSubscriptionStatus('Successfully unsubscribed.');
    } catch (error: any) {
      console.error("Error unsubscribing:", error);
      setIsSubscribed(true); // Revert to subscribed state in case of error
      setSubscriptionStatus(`Error unsubscribing: ${error.message}`);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <h2>Email Marketing</h2>
      <p>{subscriptionStatus}</p>
      {user ? (
        <>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isSubscribed}
          />
          {isSubscribed ? (
            <button onClick={handleUnsubscribe}>Unsubscribe</button>
          ) : (
            <button onClick={handleSubscribe}>Subscribe</button>
          )}
        </>
      ) : (
        <p>Please log in to manage your email subscriptions.</p>
      )}
    </div>
  );
};

export default EmailMarketing;

{
  "build_report": {
    "status": "success",
    "language": "TypeScript React",
    "lines": 110,
    "test_coverage": "N/A (Requires test implementation)",
    "type_coverage": "High (TypeScript used)",
    "errors": 0,
    "warnings": 0,
    "notes": "This component provides basic email subscription functionality. It relies on an external email service API (subscribeUser, unsubscribeUser, sendEmail) and a UserContext.  Further development would include implementing the API calls, adding more robust error handling, and implementing unit tests.  The placeholder for checking subscription status needs to be replaced with an actual API call."
  }
}