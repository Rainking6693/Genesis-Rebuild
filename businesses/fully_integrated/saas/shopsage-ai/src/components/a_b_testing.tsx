import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '../../ab-testing';

type Variant = 'control' | 'variation';
type Props = {
  messageControl: string;
  messageVariation: string;
  defaultVariant?: Variant;
};

const MyComponent: React.FC<Props> = ({ messageControl, messageVariation, defaultVariant = 'control' }) => {
  const [variant, setVariant] = useState<Variant>(defaultVariant);
  const { isLoading, error, data } = useA/BTesting('ShopSageAI_PurchaseDecisionGroup', { variant: variant || defaultVariant });

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error(error);
      setVariant(defaultVariant);
    } else if (data) {
      setVariant(data.variant as Variant);
    }
  }, [isLoading, error, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Add ARIA attributes for accessibility
  const ariaLabel = variant === 'control' ? 'Control message' : 'Variation message';
  const ariaDescribedby = variant === 'control' ? 'message-control' : 'message-variation';

  return (
    <div>
      {/* Add unique IDs for each message for screen readers */}
      <div id="message-control" role="presentation">{messageControl}</div>
      <div id="message-variation" role="presentation">{messageVariation}</div>
      <div>{variant === 'control' ? messageControl : messageVariation}</div>
      {/* Add ARIA attributes to the displayed message */}
      <div aria-label={ariaLabel} aria-describedby={ariaDescribedby}></div>
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '../../ab-testing';

type Variant = 'control' | 'variation';
type Props = {
  messageControl: string;
  messageVariation: string;
  defaultVariant?: Variant;
};

const MyComponent: React.FC<Props> = ({ messageControl, messageVariation, defaultVariant = 'control' }) => {
  const [variant, setVariant] = useState<Variant>(defaultVariant);
  const { isLoading, error, data } = useA/BTesting('ShopSageAI_PurchaseDecisionGroup', { variant: variant || defaultVariant });

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error(error);
      setVariant(defaultVariant);
    } else if (data) {
      setVariant(data.variant as Variant);
    }
  }, [isLoading, error, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Add ARIA attributes for accessibility
  const ariaLabel = variant === 'control' ? 'Control message' : 'Variation message';
  const ariaDescribedby = variant === 'control' ? 'message-control' : 'message-variation';

  return (
    <div>
      {/* Add unique IDs for each message for screen readers */}
      <div id="message-control" role="presentation">{messageControl}</div>
      <div id="message-variation" role="presentation">{messageVariation}</div>
      <div>{variant === 'control' ? messageControl : messageVariation}</div>
      {/* Add ARIA attributes to the displayed message */}
      <div aria-label={ariaLabel} aria-describedby={ariaDescribedby}></div>
    </div>
  );
};

export default MyComponent;