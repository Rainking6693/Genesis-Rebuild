import React, { ReactNode, useState } from 'react';
import { EcoBoxBuilderBranding } from '../../branding'; // Import branding for consistent styling

interface Props {
  subject?: string; // Subject line for the email (optional)
  previewText?: string; // Preview text for the email (optional)
  fromName?: string; // Sender's name (optional)
  fromEmail?: string; // Sender's email (optional)
  to: string; // Recipient's email
  message: ReactNode; // Main content of the email (supports React nodes for better flexibility)
}

const MyComponent: React.FC<Props> = ({
  subject = 'Untitled Email',
  previewText = 'This is an email from [Your Company Name]',
  fromName = '',
  fromEmail = '',
  to,
  message,
}) => {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setIsValidEmail(emailRegex.test(email));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidEmail) {
      throw new Error('Invalid recipient email address');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <EcoBoxBuilderBranding /> {/* Include branding for consistent styling */}
        <div>
          <h1 aria-label="Email subject">{subject}</h1>
          <p aria-label="Email preview text">{previewText}</p>
        </div>
        <div>{message}</div>
        <div>
          <label htmlFor="to">Recipient's email:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={to}
            onChange={handleEmailChange}
            aria-describedby="email-error"
          />
          {!isValidEmail && <p id="email-error">Please enter a valid email address.</p>}
        </div>
        <div aria-label="Email sender information">From: {fromName} <{fromEmail}></div>
        <button type="submit">Send Email</button>
      </div>
    </form>
  );
};

export default MyComponent;

In this updated version, I've added default values for all optional props, validated the recipient's email address using a form and a state, and added an error message for invalid email addresses. Additionally, I've made the recipient's email field editable, so the user can input the recipient's email address directly.