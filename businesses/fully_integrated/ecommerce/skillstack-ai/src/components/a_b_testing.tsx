import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '@skillstackai/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Control message' }) => {
  const [isVariantA, setIsVariantA] = useState(false);
  const [featureFlag, setFeatureFlag] = useA/BTesting('variantA-test', false);

  useEffect(() => {
    setIsVariantA(featureFlag);
  }, [featureFlag]);

  useEffect(() => {
    // Check initial variation and on feature flag change
    setIsVariantA(featureFlag);
    useA/BTesting.onChange('variantA-test', () => setIsVariantA(featureFlag));
  }, []);

  return (
    <div>
      {/* Control message is always present in the DOM */}
      <div id="a-b-testing-control" aria-hidden={!isVariantA}>
        {messageB}
      </div>
      {isVariantA ? (
        <div id="a-b-testing-variant" aria-hidden={!isVariantA} aria-label="A/B testing variant">
          {messageA}
        </div>
      ) : null}
      <div id="a-b-testing-info" style={{ display: 'none' }}>
        {isVariantA ? 'Variant A' : 'Variant B'}
      </div>
      {fallbackMessage && <div id="fallback-message">{fallbackMessage}</div>}
    </div>
  );
};

export default MyComponent;

In this updated version, I've made the following changes:

1. Added a `useState` hook to manage the `isVariantA` state, ensuring it has a default value of `false`.
2. Separated the feature flag check into a separate `useEffect` hook to ensure it only runs once on mount and on feature flag change.
3. Moved the control message outside the conditional to ensure it's always present in the DOM, improving screen reader support and SEO.
4. Added ARIA attributes to the component for better accessibility, allowing screen readers to announce the A/B testing variant and control message.
5. Added an `id` to the A/B testing variant and control elements for easier debugging.
6. Removed unnecessary imports and updated the `Props` interface to include both message variants.