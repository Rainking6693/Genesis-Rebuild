import React, { useState } from 'react';
import { useA/BTesting } from '../../hooks/useA_BTesting';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'An error occurred.' }) => {
  const [variant, setVariant, isLoading, error] = useA/BTesting('EcoTraceAI_CarbonNeutralityMessage', {
    fallback: fallbackMessage,
  });

  // Check if the variant is valid before rendering
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message || fallbackMessage}</div>;
  }

  if (variant !== 'A' && variant !== 'B') {
    console.error(`Invalid variant received: ${variant}`);
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      {/* Add aria-label to improve accessibility */}
      <div role="presentation">{variant === 'A' ? messageA : messageB}</div>
      {/* Add a screen reader-only message to indicate the variant */}
      <div aria-hidden={true}>{variant === 'A' ? 'Variant A' : 'Variant B'}</div>
    </div>
  );
};

export default MyComponent;

import React, { useState } from 'react';
import { useA/BTesting } from '../../hooks/useA_BTesting';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'An error occurred.' }) => {
  const [variant, setVariant, isLoading, error] = useA/BTesting('EcoTraceAI_CarbonNeutralityMessage', {
    fallback: fallbackMessage,
  });

  // Check if the variant is valid before rendering
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message || fallbackMessage}</div>;
  }

  if (variant !== 'A' && variant !== 'B') {
    console.error(`Invalid variant received: ${variant}`);
    return <div>{fallbackMessage}</div>;
  }

  return (
    <div>
      {/* Add aria-label to improve accessibility */}
      <div role="presentation">{variant === 'A' ? messageA : messageB}</div>
      {/* Add a screen reader-only message to indicate the variant */}
      <div aria-hidden={true}>{variant === 'A' ? 'Variant A' : 'Variant B'}</div>
    </div>
  );
};

export default MyComponent;