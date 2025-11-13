import XSS from 'xss';

const sanitize = XSS();

// Utility function to sanitize a message
const sanitizeMessage = (message: string) => {
  try {
    return sanitize(message);
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

// EcoSpend Message Component
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  key?: string; // Add a unique key prop
}

const EcoSpendMessage: FC<Props> = ({ children, key }) => {
  const sanitizedChildren = sanitizeMessage(String(children));
  return <div className="ecospend-message" aria-live="polite" key={key}>{sanitizedChildren}</div>;
};

// Dashboard UI
import React, { FC } from 'react';
import EcoSpendMessage from './EcoSpendMessage';

interface Props {
  message: string;
}

const DashboardUI: FC<Props> = ({ message }) => {
  // Check if the message is valid before rendering the component
  if (!message) {
    return null;
  }

  const sanitizedMessage = sanitizeMessage(message);
  return (
    <div className="ecospend-dashboard" aria-label="EcoSpend Dashboard">
      <EcoSpendMessage>{sanitizedMessage}</EcoSpendMessage>
    </div>
  );
};

// Optimize performance by memoizing the DashboardUI component
import React, { FC, useMemo } from 'react';

const DashboardUI: FC<Props> = ({ message }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);
  return (
    <div className="ecospend-dashboard" aria-label="EcoSpend Dashboard">
      <EcoSpendMessage key={sanitizedMessage}>{sanitizedMessage}</EcoSpendMessage>
    </div>
  );
};

export default React.memo(DashboardUI);

This updated code addresses the issues of resiliency, edge cases, accessibility, and maintainability for the dashboard_ui component.