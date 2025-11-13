import React, { useState } from 'react';

interface NewsletterSignupProps {
  apiUrl: string; // URL for the newsletter subscription API
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ apiUrl }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage(''); // Clear previous messages
    setSuccess(false);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setMessage(data.message);
        setSuccess(true);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      setMessage(`An error occurred: ${error.message}`);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {message && (
        <div className={success ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 92,
    "test_coverage": "75% (estimated)",
    "type_coverage": "100% (estimated)"
  }
}