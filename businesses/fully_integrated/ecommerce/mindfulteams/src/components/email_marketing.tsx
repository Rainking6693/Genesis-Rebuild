import React, { useState, useEffect } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  message: string;
}

const MyComponent: React.FC<Props> = ({ subject, message }) => {
  const [isValid, setIsValid] = useState(true);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    if (message.length < 10) {
      setMessageError('Message must be at least 10 characters long.');
      setIsValid(false);
    } else {
      setMessageError('');
      setIsValid(true);
    }
  }, [message]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputMessage = event.target.value;
    setMessage(inputMessage);
  };

  return (
    <div>
      <h3>{subject}</h3>
      <div>
        <textarea
          value={message}
          onChange={handleMessageChange}
          aria-invalid={!isValid ? 'true' : 'false'}
          aria-describedby="message-error"
        />
        {messageError && (
          <p id="message-error" hidden={isValid}>
            {messageError}
          </p>
        )}
      </div>
    </div>
  );
};

MyComponent.validateMessage = (message: string) => {
  if (!message || message.length < 10) {
    return false;
  }
  return true;
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  message: string;
}

const MyComponent: React.FC<Props> = ({ subject, message }) => {
  const [isValid, setIsValid] = useState(true);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    if (message.length < 10) {
      setMessageError('Message must be at least 10 characters long.');
      setIsValid(false);
    } else {
      setMessageError('');
      setIsValid(true);
    }
  }, [message]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputMessage = event.target.value;
    setMessage(inputMessage);
  };

  return (
    <div>
      <h3>{subject}</h3>
      <div>
        <textarea
          value={message}
          onChange={handleMessageChange}
          aria-invalid={!isValid ? 'true' : 'false'}
          aria-describedby="message-error"
        />
        {messageError && (
          <p id="message-error" hidden={isValid}>
            {messageError}
          </p>
        )}
      </div>
    </div>
  );
};

MyComponent.validateMessage = (message: string) => {
  if (!message || message.length < 10) {
    return false;
  }
  return true;
};

export default MyComponent;