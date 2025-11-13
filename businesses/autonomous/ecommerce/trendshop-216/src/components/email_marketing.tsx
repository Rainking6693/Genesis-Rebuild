// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [campaignResults, setCampaignResults] = useState<{ opens: number; clicks: number }>({ opens: 0, clicks: 0 });

  // Placeholder for fetching campaign results from a backend
  useEffect(() => {
    const fetchCampaignResults = async () => {
      try {
        // Simulate fetching data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
        setCampaignResults({ opens: 120, clicks: 35 }); // Mock data
      } catch (error: any) {
        console.error("Error fetching campaign results:", error);
        setErrorMessage("Failed to fetch campaign results.");
      }
    };

    fetchCampaignResults();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = async () => {
    try {
      if (!email) {
        throw new Error("Email address is required.");
      }

      // Basic email validation (very simple)
      if (!email.includes('@')) {
        throw new Error("Invalid email address.");
      }

      // Simulate sending email to a backend for processing
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      // In a real application, you would send the email to a backend
      // for storage and processing.  This is a placeholder.
      console.log("Subscribed email:", email);
      setSubscribed(true);
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setErrorMessage(error.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="email-marketing">
      <h2>Stay Updated with Our Newsletter!</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      {!subscribed ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      ) : (
        <p>Thank you for subscribing!</p>
      )}

      <h3>Campaign Results (Last Week)</h3>
      <p>Opens: {campaignResults.opens}</p>
      <p>Clicks: {campaignResults.clicks}</p>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [campaignResults, setCampaignResults] = useState<{ opens: number; clicks: number }>({ opens: 0, clicks: 0 });

  // Placeholder for fetching campaign results from a backend
  useEffect(() => {
    const fetchCampaignResults = async () => {
      try {
        // Simulate fetching data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay
        setCampaignResults({ opens: 120, clicks: 35 }); // Mock data
      } catch (error: any) {
        console.error("Error fetching campaign results:", error);
        setErrorMessage("Failed to fetch campaign results.");
      }
    };

    fetchCampaignResults();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = async () => {
    try {
      if (!email) {
        throw new Error("Email address is required.");
      }

      // Basic email validation (very simple)
      if (!email.includes('@')) {
        throw new Error("Invalid email address.");
      }

      // Simulate sending email to a backend for processing
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call delay

      // In a real application, you would send the email to a backend
      // for storage and processing.  This is a placeholder.
      console.log("Subscribed email:", email);
      setSubscribed(true);
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error subscribing:", error);
      setErrorMessage(error.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="email-marketing">
      <h2>Stay Updated with Our Newsletter!</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}

      {!subscribed ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      ) : (
        <p>Thank you for subscribing!</p>
      )}

      <h3>Campaign Results (Last Week)</h3>
      <p>Opens: {campaignResults.opens}</p>
      <p>Clicks: {campaignResults.clicks}</p>
    </div>
  );
};

export default EmailMarketing;