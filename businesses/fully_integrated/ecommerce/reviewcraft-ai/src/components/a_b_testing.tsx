import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ABTest, VariantNotFoundError } from 'reviewcraft-ai-ab-testing';

interface Props {
  message: string;
  variant: string;
  fallbackVariant?: string;
}

const MyComponent: FC<Props> = ({ message, variant, fallbackVariant }) => {
  const [activeVariant, setActiveVariant] = useState<string | null>(null);

  useEffect(() => {
    const handleVariantChange = (newVariant: string) => {
      setActiveVariant(newVariant);
    };

    const handleVariantNotFound = () => {
      if (fallbackVariant) {
        console.warn(`Variant "${variant}" not found. Using fallback variant "${fallbackVariant}" instead.`);
        handleVariantChange(fallbackVariant);
      } else {
        throw new Error(`No variant found for A/B test and no fallback variant provided.`);
      }
    };

    ABTest.onVariantNotFound(handleVariantNotFound);
    handleVariantChange(ABTest.getActiveVariant());

    return () => {
      ABTest.offVariantNotFound(handleVariantNotFound);
    };
  }, [fallbackVariant, variant]);

  return (
    <>
      <ABTest variant={variant}>
        {(children) => (
          <div role="presentation" data-testid="my-component">
            {children}
          </div>
        )}
      </ABTest>

      {activeVariant !== null && (
        <div role="alert" aria-live="assertive" data-testid="variant-notification">
          {activeVariant !== ABTest.getActiveVariant() && (
            <>
              Variant changed: {ABTest.getActiveVariant()}
            </>
          )}
        </div>
      )}

      <div>{message}</div>
    </>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ABTest, VariantNotFoundError } from 'reviewcraft-ai-ab-testing';

interface Props {
  message: string;
  variant: string;
  fallbackVariant?: string;
}

const MyComponent: FC<Props> = ({ message, variant, fallbackVariant }) => {
  const [activeVariant, setActiveVariant] = useState<string | null>(null);

  useEffect(() => {
    const handleVariantChange = (newVariant: string) => {
      setActiveVariant(newVariant);
    };

    const handleVariantNotFound = () => {
      if (fallbackVariant) {
        console.warn(`Variant "${variant}" not found. Using fallback variant "${fallbackVariant}" instead.`);
        handleVariantChange(fallbackVariant);
      } else {
        throw new Error(`No variant found for A/B test and no fallback variant provided.`);
      }
    };

    ABTest.onVariantNotFound(handleVariantNotFound);
    handleVariantChange(ABTest.getActiveVariant());

    return () => {
      ABTest.offVariantNotFound(handleVariantNotFound);
    };
  }, [fallbackVariant, variant]);

  return (
    <>
      <ABTest variant={variant}>
        {(children) => (
          <div role="presentation" data-testid="my-component">
            {children}
          </div>
        )}
      </ABTest>

      {activeVariant !== null && (
        <div role="alert" aria-live="assertive" data-testid="variant-notification">
          {activeVariant !== ABTest.getActiveVariant() && (
            <>
              Variant changed: {ABTest.getActiveVariant()}
            </>
          )}
        </div>
      )}

      <div>{message}</div>
    </>
  );
};

export default MyComponent;