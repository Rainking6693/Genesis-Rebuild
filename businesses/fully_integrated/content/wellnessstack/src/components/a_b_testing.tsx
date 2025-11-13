import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../ab-testing';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = '' }) => {
  const [selectedMessage, setSelectedMessage] = useState(fallbackMessage);
  const [, updateSelectedMessage] = useA/BTesting('wellness-content-message');

  const handleMessageUpdate = async (newMessage: string) => {
    try {
      await updateSelectedMessage(newMessage);
      setSelectedMessage(newMessage);
    } catch (error) {
      console.error('Error updating A/B testing message:', error);
      setSelectedMessage(fallbackMessage);
    }
  };

  useEffect(() => {
    handleMessageUpdate(selectedMessage);
  }, [selectedMessage, updateSelectedMessage, fallbackMessage]);

  return (
    <div>
      {selectedMessage || message}
      {/* Add ARIA-live region for accessibility */}
      <div aria-live="polite">
        {/* Display the selected message for screen readers */}
        {selectedMessage}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '../../ab-testing';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = '' }) => {
  const [selectedMessage, setSelectedMessage] = useState(fallbackMessage);
  const [, updateSelectedMessage] = useA/BTesting('wellness-content-message');

  const handleMessageUpdate = async (newMessage: string) => {
    try {
      await updateSelectedMessage(newMessage);
      setSelectedMessage(newMessage);
    } catch (error) {
      console.error('Error updating A/B testing message:', error);
      setSelectedMessage(fallbackMessage);
    }
  };

  useEffect(() => {
    handleMessageUpdate(selectedMessage);
  }, [selectedMessage, updateSelectedMessage, fallbackMessage]);

  return (
    <div>
      {selectedMessage || message}
      {/* Add ARIA-live region for accessibility */}
      <div aria-live="polite">
        {/* Display the selected message for screen readers */}
        {selectedMessage}
      </div>
    </div>
  );
};

export default MyComponent;