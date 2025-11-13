import React, { FC, useId, useEffect } from 'react';

interface Props {
  message: string;
  onMessageShown?: () => void; // Add an optional callback for when the message is shown
}

const ReferralSystemMessage: FC<Props> = ({ message, onMessageShown }) => {
  const id = useId();

  useEffect(() => {
    // Show the message immediately on mount
    onMessageShown?.();
  }, []);

  return (
    <div>
      {/* Add a unique ID for accessibility and tracking purposes */}
      <div id={id} role="alert" aria-live="polite" aria-describedby={id}>
        {message}
      </div>
      {/* Add a hidden label for screen readers to announce the message */}
      <div id={id} style={{ position: 'absolute', width: 1, height: 1, margin: -1 }}>
        {message}
      </div>
    </div>
  );
};

export default ReferralSystemMessage;

import React, { FC, useId, useEffect } from 'react';

interface Props {
  message: string;
  onMessageShown?: () => void; // Add an optional callback for when the message is shown
}

const ReferralSystemMessage: FC<Props> = ({ message, onMessageShown }) => {
  const id = useId();

  useEffect(() => {
    // Show the message immediately on mount
    onMessageShown?.();
  }, []);

  return (
    <div>
      {/* Add a unique ID for accessibility and tracking purposes */}
      <div id={id} role="alert" aria-live="polite" aria-describedby={id}>
        {message}
      </div>
      {/* Add a hidden label for screen readers to announce the message */}
      <div id={id} style={{ position: 'absolute', width: 1, height: 1, margin: -1 }}>
        {message}
      </div>
    </div>
  );
};

export default ReferralSystemMessage;