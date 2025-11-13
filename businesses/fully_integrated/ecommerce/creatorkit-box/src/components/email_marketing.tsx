import React, { useEffect, useState } from 'react';
import { validateEmail } from './utils/emailValidation';
import { Analytics } from './Analytics';
import { Button, Form } from './ReusableComponents';
import next from 'next';

interface Props {
  recipientEmail: string;
  message: string;
}

const validateRecipientEmail = (recipientEmail: string) => {
  if (!validateEmail(recipientEmail)) {
    throw new Error('Invalid email address');
  }
};

const MyComponent: React.FC<Props> = ({ recipientEmail, message }) => {
  const [email, setEmail] = useState(recipientEmail);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      validateRecipientEmail(email);
      // Add your API call here
      await sendEmail(email);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    Analytics.trackEmailOpen();
  }, [email]); // Update the dependency to email to ensure analytics is only tracked when the email changes

  return (
    <div>
      <h1>Email Marketing Component</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <label htmlFor="recipientEmail">Recipient Email:</label>
        <input
          id="recipientEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          aria-describedby="email-error" // Add an aria-describedby attribute to associate the error message with the input field
        />
        <Button type="submit">Send Email</Button>
        {error && <p id="email-error" role="alert">{error}</p>} // Create an accessible error message
      </Form>
      <p>{message}</p>
    </div>
  );
};

// Add your sendEmail function here
// Consider using a library like Next.js for server-side rendering to improve SEO and performance

export default next({
  reactRouter: false,
}).default(MyComponent);

In this updated code, I've added an `aria-describedby` attribute to the input field to associate the error message with it, making it more accessible. I've also updated the `useEffect` dependency to include the `email` state so that analytics is only tracked when the email changes. Lastly, I've added an accessible error message for screen reader users. You'll still need to add your own `sendEmail` function and analytics tracking for click events.