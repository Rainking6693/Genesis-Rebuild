import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  content: string;
}

const MyComponent = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      if (formRef.current) {
        formRef.current.reportValidity();
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/messages', { content: message });
      const newMessage: Message = response.data;
      setMessage('');
      // Handle the new message here, e.g., display it to the user
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label htmlFor="message-input">Message:</label>
      <input
        type="text"
        id="message-input"
        value={message}
        onChange={handleMessageChange}
        aria-describedby="message-error"
        required
      />
      {error && <div id="message-error" role="alert">{error.message}</div>}
      {loading && <div>Sending message...</div>}
      <button type="submit" disabled={loading}>Send</button>
    </form>
  );
};

export default MyComponent;

1. Added a form ref to handle form validation.
2. Added the `required` attribute to the input field to ensure it's always filled.
3. Added a timeout to automatically clear the error message after 5 seconds.
4. Disabled the submit button while the message is being sent.
5. Improved the accessibility of the error message by adding the `role="alert"` attribute.