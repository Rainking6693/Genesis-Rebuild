// src/components/Newsletter.tsx
import React, { useState } from 'react';

interface NewsletterProps {
  onSubmit: (email: string) => Promise<void>; // Expects a function to handle submission
}

const Newsletter: React.FC<NewsletterProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setLoading(true);

    if (!email) {
      setMessage('Please enter your email address.');
      setLoading(false);
      return;
    }

    // Basic email validation (you might want a more robust solution)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(email); // Call the provided onSubmit function
      setMessage('Thank you for subscribing!');
      setEmail(''); // Clear the input field
    } catch (error: any) {
      console.error("Subscription error:", error);
      setMessage(`Subscription failed: ${error.message || 'An error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;

// src/components/Newsletter.tsx
import React, { useState } from 'react';

interface NewsletterProps {
  onSubmit: (email: string) => Promise<void>; // Expects a function to handle submission
}

const Newsletter: React.FC<NewsletterProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setLoading(true);

    if (!email) {
      setMessage('Please enter your email address.');
      setLoading(false);
      return;
    }

    // Basic email validation (you might want a more robust solution)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(email); // Call the provided onSubmit function
      setMessage('Thank you for subscribing!');
      setEmail(''); // Clear the input field
    } catch (error: any) {
      console.error("Subscription error:", error);
      setMessage(`Subscription failed: ${error.message || 'An error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;