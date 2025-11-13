import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Props {
  initialMessage: string;
  onMessageChange: Dispatch<SetStateAction<string>>;
  maxLength?: number;
  minLength?: number;
  allowedSpecialChars?: string;
  disallowedSpecialChars?: string;
}

const RestApi: React.FC<Props> = ({
  initialMessage,
  onMessageChange,
  maxLength = 255,
  minLength = 1,
  allowedSpecialChars = '!@#$%^&*()_+-=',
  disallowedSpecialChars = '',
}) => {
  const [message, setMessage] = onMessageChange || useState(initialMessage);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    setMessage(initialMessage);
    validateMessage();
  }, [initialMessage, maxLength, minLength, allowedSpecialChars, disallowedSpecialChars]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();

    if (inputValue.length === 0) {
      setMessageError('Message cannot be empty');
      return;
    }

    setMessage(inputValue);
    setMessageError('');
  };

  const validateMessage = () => {
    if (message.length === 0) {
      setMessageError('Message cannot be empty');
      return;
    }

    const specialChars = new RegExp(`[${disallowedSpecialChars}]`, 'g');
    const isValid =
      message.length >= minLength &&
      message.length <= maxLength &&
      message.match(specialChars) === null &&
      allowedSpecialChars.includes(message.match(/[${allowedSpecialChars}]/g)[0]);

    if (!isValid) {
      setMessageError('Invalid message format');
    } else {
      setMessageError('');
    }
  };

  return (
    <div>
      <label htmlFor="messageInput">
        Message (Max {maxLength} characters, Min {minLength} characters, Allowed Special Characters: {allowedSpecialChars}, Disallowed Special Characters: {disallowedSpecialChars})
      </label>
      <input
        id="messageInput"
        aria-label="Message input field"
        value={message}
        onChange={handleInputChange}
      />
      {messageError && <p style={{ color: 'red' }}>{messageError}</p>}
    </div>
  );
};

export default RestApi;

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface Props {
  initialMessage: string;
  onMessageChange: Dispatch<SetStateAction<string>>;
  maxLength?: number;
  minLength?: number;
  allowedSpecialChars?: string;
  disallowedSpecialChars?: string;
}

const RestApi: React.FC<Props> = ({
  initialMessage,
  onMessageChange,
  maxLength = 255,
  minLength = 1,
  allowedSpecialChars = '!@#$%^&*()_+-=',
  disallowedSpecialChars = '',
}) => {
  const [message, setMessage] = onMessageChange || useState(initialMessage);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    setMessage(initialMessage);
    validateMessage();
  }, [initialMessage, maxLength, minLength, allowedSpecialChars, disallowedSpecialChars]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();

    if (inputValue.length === 0) {
      setMessageError('Message cannot be empty');
      return;
    }

    setMessage(inputValue);
    setMessageError('');
  };

  const validateMessage = () => {
    if (message.length === 0) {
      setMessageError('Message cannot be empty');
      return;
    }

    const specialChars = new RegExp(`[${disallowedSpecialChars}]`, 'g');
    const isValid =
      message.length >= minLength &&
      message.length <= maxLength &&
      message.match(specialChars) === null &&
      allowedSpecialChars.includes(message.match(/[${allowedSpecialChars}]/g)[0]);

    if (!isValid) {
      setMessageError('Invalid message format');
    } else {
      setMessageError('');
    }
  };

  return (
    <div>
      <label htmlFor="messageInput">
        Message (Max {maxLength} characters, Min {minLength} characters, Allowed Special Characters: {allowedSpecialChars}, Disallowed Special Characters: {disallowedSpecialChars})
      </label>
      <input
        id="messageInput"
        aria-label="Message input field"
        value={message}
        onChange={handleInputChange}
      />
      {messageError && <p style={{ color: 'red' }}>{messageError}</p>}
    </div>
  );
};

export default RestApi;