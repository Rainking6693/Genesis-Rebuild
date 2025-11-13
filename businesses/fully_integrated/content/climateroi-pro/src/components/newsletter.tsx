import React, { useState, useRef } from 'react';
import { forwardRef } from 'react';

interface NewsletterSignupProps {
  onSubmit: (email: string) => void;
}

const NewsletterSignup = forwardRef<HTMLFormElement, NewsletterSignupProps>(({ onSubmit }, ref) => {
  const [email, setEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateEmail(email)) {
      onSubmit(email);
      setEmail('');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <label htmlFor="email">
        Sign up for our newsletter
        <input
          type="email"
          id="email"
          aria-label="Enter your email address to sign up for our newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailInputRef}
        />
      </label>
      <button type="submit">Sign Up</button>
      {!emailInputRef.current && <div>Fallback content if email input is not found</div>}
    </form>
  );
});

export default NewsletterSignup;

import React, { useState, useRef } from 'react';
import { forwardRef } from 'react';

interface NewsletterSignupProps {
  onSubmit: (email: string) => void;
}

const NewsletterSignup = forwardRef<HTMLFormElement, NewsletterSignupProps>(({ onSubmit }, ref) => {
  const [email, setEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateEmail(email)) {
      onSubmit(email);
      setEmail('');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <label htmlFor="email">
        Sign up for our newsletter
        <input
          type="email"
          id="email"
          aria-label="Enter your email address to sign up for our newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailInputRef}
        />
      </label>
      <button type="submit">Sign Up</button>
      {!emailInputRef.current && <div>Fallback content if email input is not found</div>}
    </form>
  );
});

export default NewsletterSignup;