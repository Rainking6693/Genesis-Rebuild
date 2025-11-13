import React, { useState } from 'react';
import { useA/BTesting } from '../../hooks/useA_BTesting';

interface Props {
  messageA: string;
  messageB: string;
  id: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, id, fallbackMessage = 'Default message' }) => {
  const [variant, setVariant] = useA/BTesting(id);

  // Check if the variant is valid, otherwise use the fallback message
  const selectedMessage = variant === 'A' ? messageA : variant === 'B' ? messageB : fallbackMessage;

  // Add a check for null or undefined variant to prevent errors
  if (!variant) return <div id={`a-b-testing-error-${id}`} role="alert">An error occurred while loading the variant.</div>;

  // Handle edge case where the variant is not 'A' or 'B'
  if (variant !== 'A' && variant !== 'B') {
    console.error(`Unexpected variant value: ${variant} for component id: ${id}`);
    return <div id={`a-b-testing-error-${id}`} role="alert">An unexpected variant value was received.</div>;
  }

  // Add ARIA attributes for accessibility
  return (
    <div>
      <div id={`a-b-testing-result-${id}`} role="status" aria-live="polite">
        {variant === 'A' ? 'Variant A is active' : 'Variant B is active'}
      </div>
      <div>{selectedMessage}</div>
    </div>
  );
};

export default MyComponent;

import React, { useState } from 'react';
import { useA/BTesting } from '../../hooks/useA_BTesting';

interface Props {
  messageA: string;
  messageB: string;
  id: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, id, fallbackMessage = 'Default message' }) => {
  const [variant, setVariant] = useA/BTesting(id);

  // Check if the variant is valid, otherwise use the fallback message
  const selectedMessage = variant === 'A' ? messageA : variant === 'B' ? messageB : fallbackMessage;

  // Add a check for null or undefined variant to prevent errors
  if (!variant) return <div id={`a-b-testing-error-${id}`} role="alert">An error occurred while loading the variant.</div>;

  // Handle edge case where the variant is not 'A' or 'B'
  if (variant !== 'A' && variant !== 'B') {
    console.error(`Unexpected variant value: ${variant} for component id: ${id}`);
    return <div id={`a-b-testing-error-${id}`} role="alert">An unexpected variant value was received.</div>;
  }

  // Add ARIA attributes for accessibility
  return (
    <div>
      <div id={`a-b-testing-result-${id}`} role="status" aria-live="polite">
        {variant === 'A' ? 'Variant A is active' : 'Variant B is active'}
      </div>
      <div>{selectedMessage}</div>
    </div>
  );
};

export default MyComponent;