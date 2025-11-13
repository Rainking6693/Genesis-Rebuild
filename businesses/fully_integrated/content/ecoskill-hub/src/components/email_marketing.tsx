import React from 'react';
import { EcoSkillHubBranding } from '../../branding'; // Import branding for consistent styling

interface Props {
  subject: string; // Subject line for the email
  preheader?: string; // Preheader text for the email (optional)
  fromName: string; // Sender's name
  fromEmail: string; // Sender's email address
  to?: string; // Recipient's email address (optional)
  body: JSX.Element; // Email content as JSX
  altBody?: JSX.Element; // Alternative body for non-HTML email clients (optional)
}

const EmailTemplate: React.FC<Props> = ({
  subject,
  preheader = '',
  fromName,
  fromEmail,
  to = 'no-reply@ecoskillhub.com',
  body,
  altBody = <div>Your email client does not support HTML. Please view this email in a modern web mail client.</div>,
}) => {
  const defaultTo = 'no-reply@ecoskillhub.com';

  // Check if recipientEmail is a valid email address
  const isValidEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  if (!isValidEmail(to)) {
    console.warn(`Invalid recipient email address: ${to}`);
    to = defaultTo;
  }

  return (
    <html lang="en" role="presentation">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{subject}</title>
        <style>{`
          body,
          table,
          td,
          a {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 16px;
            line-height: 1.5;
          }
          table {
            border-collapse: collapse;
          }
          a[href] {
            text-decoration: none;
            color: #333;
          }
          @media screen and (max-width: 600px) {
            body {
              width: 100% !important;
              overflow-x: auto !important;
            }
          }
        `}</style>
      </head>
      <body style={{ fontSize: '16px', lineHeight: '1.5' }} role="presentation">
        <div data-testid="email-container" className={`${EcoSkillHubBranding.container} email-container`}>
          <div data-testid="email-content" className={`${EcoSkillHubBranding.content} email-content`} tabIndex={-1}>
            <h1 tabIndex={-1}>{subject}</h1>
            {preheader && <p tabIndex={-1}>{preheader}</p>}
            {body}
          </div>
        </div>
        {/* Add alternative body for non-HTML email clients */}
        <div style={{ display: 'none' }}>{altBody}</div>
      </body>
    </html>
  );
};

export default EmailTemplate;

Changes made:

1. Added an optional `altBody` prop for non-HTML email clients.
2. Added a validation check for the recipient email address.
3. Improved the email's accessibility by adding tabIndex attributes to important elements.
4. Added a responsive design media query for mobile devices.
5. Consolidated the font size and line height styles into a single style block for better maintainability.
6. Added a style for the alternative body to hide it from modern email clients.