import React, { FC, useState, useEffect, useRef, KeyboardEvent } from 'react';

interface Props {
  message?: string;
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  // Add a unique ID for accessibility and easier tracking
  const id = 'green-shift-analytics-customer-support-bot';

  // Import necessary libraries for security best practices
  import sanitizeHtml from 'sanitize-html';
  import { sanitize } from 'dompurify';

  // Sanitize user input to prevent XSS attacks
  const sanitizeUserInput = (input: string) => {
    const allowedTags = ['div', 'span', 'a']; // Add 'a' tag for links
    const sanitizedInput = sanitizeHtml(input, { allowedTags, FORBID_TAGS: { script: 1 } }); // Forbid script tag
    return sanitizedInput;
  };

  // State and state management
  const [sanitizedMessage, setSanitizedMessage] = useState(message || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Validation function
  const isValidInput = (input: string) => input.trim().length > 0;

  // Handle user input changes to sanitize the message
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (isValidInput(input)) {
      setSanitizedMessage(sanitizeUserInput(input));
    }
  };

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Prevent form submission and update the message state on Enter key press
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current?.value;
    if (isValidInput(input)) {
      setSanitizedMessage(sanitizeUserInput(input));
      inputRef.current.value = '';
    }
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFormSubmit(event);
    }
  };

  return (
    <div className={id}>
      {/* Render the sanitized message */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />

      {/* Add a form for user input */}
      <form onSubmit={handleFormSubmit} role="presentation">
        <label htmlFor={id}>Message:</label>
        <input
          type="text"
          id={id}
          ref={inputRef}
          value={sanitizedMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here"
          maxLength={200} // Add a max length for the input
          aria-labelledby={id} // Associate the label with the input for better accessibility
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

// Add a type for the exported default component
export default CustomerSupportBot;

This updated code addresses the requested improvements and adds additional features for better user experience and accessibility.