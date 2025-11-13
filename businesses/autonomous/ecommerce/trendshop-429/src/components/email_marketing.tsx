// src/components/EmailMarketing.tsx
import React, { useState } from 'react';

interface EmailMarketingProps {
  onSubmit: (email: string) => Promise<void>; // Hypothetical API call
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      await onSubmit(email); // Call the hypothetical API
      setStatus('success');
    } catch (error: any) {
      console.error("Error submitting email:", error);
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again later.');
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="email-marketing">
      <h2>Subscribe to our Newsletter</h2>
      {status === 'success' && <p className="success-message">Thank you for subscribing!</p>}
      {status === 'error' && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
        />
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default EmailMarketing;