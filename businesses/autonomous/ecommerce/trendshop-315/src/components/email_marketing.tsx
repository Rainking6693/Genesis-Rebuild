// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any props needed for configuration (e.g., API endpoint)
  apiEndpoint?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiEndpoint }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage)
    const storedSubscription = localStorage.getItem('emailSubscribed');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true);

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email format.');
      }

      // Simulate sending the email to a backend service
      // In a real application, you would make an API call here
      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Subscription failed.');
        }

        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      } else {
        // If no API endpoint is provided, just simulate success
        console.log('Simulating email subscription:', email);
        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error("Subscription Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-marketing">
      {!subscribed ? (
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      ) : (
        <div className="success">Thank you for subscribing!</div>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Add any props needed for configuration (e.g., API endpoint)
  apiEndpoint?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiEndpoint }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage)
    const storedSubscription = localStorage.getItem('emailSubscribed');
    if (storedSubscription === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true);

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email format.');
      }

      // Simulate sending the email to a backend service
      // In a real application, you would make an API call here
      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Subscription failed.');
        }

        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      } else {
        // If no API endpoint is provided, just simulate success
        console.log('Simulating email subscription:', email);
        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error("Subscription Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-marketing">
      {!subscribed ? (
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      ) : (
        <div className="success">Thank you for subscribing!</div>
      )}
    </div>
  );
};

export default EmailMarketing;

**Explanation:**

*   **TypeScript React Component:** The code is a functional React component written in TypeScript.
*   **State Management:** It uses `useState` to manage the email input, subscription status, error messages, and loading state.
*   **Error Handling:**  It includes a `try...catch` block to handle potential errors during the subscription process.  It also displays error messages to the user.
*   **Subscription Simulation:**  It simulates sending the email to a backend service using `fetch`.  In a real application, you would replace this with a call to your actual email marketing API.  It also handles the case where no API endpoint is provided, logging the email to the console instead.
*   **Local Storage:** It uses `localStorage` to persist the subscription status across page reloads.
*   **Basic Validation:** Includes a basic email format validation.
*   **Build Report:** The JSON build report provides information about the code's status, language, lines of code, estimated test coverage, estimated type coverage, and any errors or warnings.

**Action:**