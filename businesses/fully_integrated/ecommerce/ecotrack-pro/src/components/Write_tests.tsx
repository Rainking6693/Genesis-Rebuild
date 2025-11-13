import React, { useState, useEffect, useCallback, useMemo, Dispatch, SetStateAction } from 'react';

interface Props {
  message?: string; // Adding a question mark to make message optional
  onMessageChange?: Dispatch<SetStateAction<string>>;
}

const MySustainabilityAnalyticsComponent: React.FC<Props> = ({ message, onMessageChange }) => {
  const [localMessage, setLocalMessage] = useState(message || ''); // Adding a default value for localMessage

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalMessage(newValue);
    if (onMessageChange) {
      onMessageChange(newValue);
    }
  }, [onMessageChange]);

  const memoizedMessage = useMemo(() => localMessage, [localMessage]);

  useEffect(() => {
    if (onMessageChange) {
      onMessageChange(localMessage);
    }
  }, [localMessage, onMessageChange]);

  // Adding a role and aria-label for accessibility
  // Adding a maxLength to handle edge cases where the input might contain too many characters
  return (
    <div role="textbox" aria-label="Sustainability message input" maxLength={255}>
      {memoizedMessage}
      <input
        type="text"
        value={localMessage}
        onChange={handleMessageChange}
        // Adding aria-describedby for accessibility
        aria-describedby="sustainability-message-input-description"
      />
      <div id="sustainability-message-input-description" hidden>
        Enter your sustainability message (max 255 characters)
      </div>
    </div>
  );
};

export default MySustainabilityAnalyticsComponent;

import React, { useState, useEffect, useCallback, useMemo, Dispatch, SetStateAction } from 'react';

interface Props {
  message?: string; // Adding a question mark to make message optional
  onMessageChange?: Dispatch<SetStateAction<string>>;
}

const MySustainabilityAnalyticsComponent: React.FC<Props> = ({ message, onMessageChange }) => {
  const [localMessage, setLocalMessage] = useState(message || ''); // Adding a default value for localMessage

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalMessage(newValue);
    if (onMessageChange) {
      onMessageChange(newValue);
    }
  }, [onMessageChange]);

  const memoizedMessage = useMemo(() => localMessage, [localMessage]);

  useEffect(() => {
    if (onMessageChange) {
      onMessageChange(localMessage);
    }
  }, [localMessage, onMessageChange]);

  // Adding a role and aria-label for accessibility
  // Adding a maxLength to handle edge cases where the input might contain too many characters
  return (
    <div role="textbox" aria-label="Sustainability message input" maxLength={255}>
      {memoizedMessage}
      <input
        type="text"
        value={localMessage}
        onChange={handleMessageChange}
        // Adding aria-describedby for accessibility
        aria-describedby="sustainability-message-input-description"
      />
      <div id="sustainability-message-input-description" hidden>
        Enter your sustainability message (max 255 characters)
      </div>
    </div>
  );
};

export default MySustainabilityAnalyticsComponent;