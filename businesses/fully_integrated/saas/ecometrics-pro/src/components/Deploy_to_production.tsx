import React, { FC, ReactNode } from 'react';

interface Props {
  businessName: string; // Use a more descriptive name for the prop to align with the business context
  fallbackMessage?: ReactNode; // Add a fallback message for edge cases where businessName is not provided
  onError?: () => void; // Add an optional callback for handling errors
}

const EcoMetricsProComponent: FC<Props> = ({ businessName, fallbackMessage = 'An error occurred. Please try again.', onError }) => {
  if (!businessName) {
    if (onError) onError();
    return fallbackMessage;
  }

  return (
    <h1>
      Welcome to EcoMetrics Pro, <span id="business-name" aria-label={`Business name: ${businessName}`} />!
    </h1>
  );
};

EcoMetricsProComponent.defaultProps = {
  fallbackMessage: 'An error occurred. Please provide a business name.',
};

export default EcoMetricsProComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  businessName: string; // Use a more descriptive name for the prop to align with the business context
  fallbackMessage?: ReactNode; // Add a fallback message for edge cases where businessName is not provided
  onError?: () => void; // Add an optional callback for handling errors
}

const EcoMetricsProComponent: FC<Props> = ({ businessName, fallbackMessage = 'An error occurred. Please try again.', onError }) => {
  if (!businessName) {
    if (onError) onError();
    return fallbackMessage;
  }

  return (
    <h1>
      Welcome to EcoMetrics Pro, <span id="business-name" aria-label={`Business name: ${businessName}`} />!
    </h1>
  );
};

EcoMetricsProComponent.defaultProps = {
  fallbackMessage: 'An error occurred. Please provide a business name.',
};

export default EcoMetricsProComponent;