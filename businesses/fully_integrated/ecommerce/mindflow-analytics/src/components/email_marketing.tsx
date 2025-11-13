import React from 'react';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Check correctness, completeness, and quality
  if (!subject || !body) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error: Subject and body are required</h1>
        <p>Please provide a valid subject and body for the email marketing campaign.</p>
      </div>
    );
  }

  // Ensure consistency with business context
  const title = `MindFlow Analytics: ${subject}`;
  const content = `
    <p>Dear valued customer,</p>
    <p>${body}</p>
    <p>Sincerely,<br>
    The MindFlow Analytics Team</p>
  `;

  // Apply security best practices
  const sanitizedTitle = sanitizeHTML(title);
  const sanitizedContent = sanitizeHTML(content);

  // Optimize performance
  return (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
        role="region"
        tabIndex={0}
      />
    </div>
  );
};

export default EmailMarketing;

/**
 * Sanitizes HTML input to prevent XSS attacks.
 * @param html - The HTML string to be sanitized.
 * @returns The sanitized HTML string.
 */
function sanitizeHTML(html: string): string {
  return html.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&#39;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}

import React from 'react';

interface EmailMarketingProps {
  subject: string;
  body: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ subject, body }) => {
  // Check correctness, completeness, and quality
  if (!subject || !body) {
    return (
      <div role="alert" aria-live="assertive">
        <h1>Error: Subject and body are required</h1>
        <p>Please provide a valid subject and body for the email marketing campaign.</p>
      </div>
    );
  }

  // Ensure consistency with business context
  const title = `MindFlow Analytics: ${subject}`;
  const content = `
    <p>Dear valued customer,</p>
    <p>${body}</p>
    <p>Sincerely,<br>
    The MindFlow Analytics Team</p>
  `;

  // Apply security best practices
  const sanitizedTitle = sanitizeHTML(title);
  const sanitizedContent = sanitizeHTML(content);

  // Optimize performance
  return (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
        role="region"
        tabIndex={0}
      />
    </div>
  );
};

export default EmailMarketing;

/**
 * Sanitizes HTML input to prevent XSS attacks.
 * @param html - The HTML string to be sanitized.
 * @returns The sanitized HTML string.
 */
function sanitizeHTML(html: string): string {
  return html.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&#39;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}