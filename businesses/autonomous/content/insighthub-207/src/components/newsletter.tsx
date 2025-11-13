// src/components/NewsletterSignup.tsx
import React, { useState } from 'react';

interface NewsletterSignupProps {
  onSubmit: (email: string) => Promise<void>; // Function to handle email submission
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setLoading(true);

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error("Invalid email address.");
      }

      await onSubmit(email); // Call the provided onSubmit function

      setSuccess(true);
      setEmail(''); // Clear the input field
    } catch (err: any) {
      setError(err.message || "An error occurred while subscribing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {success && <div style={{ color: 'green' }}>Successfully subscribed!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;