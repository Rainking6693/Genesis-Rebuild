import React, { FC, useCallback, useMemo, useState } from 'react';
import { useSanitizedHTML } from './hooks/useSanitizedHTML';

type Props = {
  message?: string; // Added default value for message prop
};

const EcoTeamHubSanitizedMessage: FC<Props> = ({ message = '' }) => {
  const [error, setError] = useState<Error | null>(null);
  const sanitizedMessage = useSanitizedHTML(message, setError);

  const handleSanitizedMessage = useCallback(() => sanitizedMessage, [sanitizedMessage]);

  if (error) {
    return <div data-testid="error-message">An error occurred while sanitizing the message: {error.message}</div>;
  }

  return (
    <div
      data-testid="sanitized-message"
      role="presentation" // Added role attribute for better accessibility
      aria-label={message} // Added aria-label for accessibility
      title={message} // Added title attribute for better accessibility
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export const EcoTeamHubMyComponent = React.memo(EcoTeamHubSanitizedMessage);

import React, { FC, useCallback, useMemo, useState } from 'react';
import { useSanitizedHTML } from './hooks/useSanitizedHTML';

type Props = {
  message?: string; // Added default value for message prop
};

const EcoTeamHubSanitizedMessage: FC<Props> = ({ message = '' }) => {
  const [error, setError] = useState<Error | null>(null);
  const sanitizedMessage = useSanitizedHTML(message, setError);

  const handleSanitizedMessage = useCallback(() => sanitizedMessage, [sanitizedMessage]);

  if (error) {
    return <div data-testid="error-message">An error occurred while sanitizing the message: {error.message}</div>;
  }

  return (
    <div
      data-testid="sanitized-message"
      role="presentation" // Added role attribute for better accessibility
      aria-label={message} // Added aria-label for accessibility
      title={message} // Added title attribute for better accessibility
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export const EcoTeamHubMyComponent = React.memo(EcoTeamHubSanitizedMessage);