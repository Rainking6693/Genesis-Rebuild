import React, { useState, useEffect, useMemo, CSSProperties } from 'react';

interface ABTestConfig {
  control: React.ReactNode;
  variation: React.ReactNode;
  weights?: { control: number; variation: number };
  storageKey?: string; // Key for persisting the chosen variant
}

interface ABTestProps extends ABTestConfig {
  onVariantChosen?: (variant: 'control' | 'variation') => void;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode; // What to render if both variants fail
  style?: CSSProperties; // Optional styling for the container
  className?: string; // Optional class name for the container
  'aria-label'?: string; // Accessibility label for the container
}

const useABTestVariant = (config: ABTestConfig): 'control' | 'variation' => {
  const { weights = { control: 0.5, variation: 0.5 }, storageKey } = config;

  const [variant, setVariant] = useState<'control' | 'variation'>(() => {
    if (storageKey) {
      const storedVariant = localStorage.getItem(storageKey);
      if (storedVariant === 'control' || storedVariant === 'variation') {
        return storedVariant;
      }
    }
    return Math.random() < weights.control ? 'control' : 'variation';
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, variant);
    }
  }, [variant, storageKey]);

  return variant;
};

const ABTest: React.FC<ABTestProps> = ({
  control,
  variation,
  weights,
  onVariantChosen,
  onError,
  fallback = null,
  storageKey,
  style,
  className,
  'aria-label': ariaLabel,
}) => {
  const variant = useABTestVariant({ control, variation, weights, storageKey });

  const chosenVariant = useMemo(() => {
    try {
      return variant === 'control' ? control : variation;
    } catch (error: any) {
      console.error('Error rendering variant:', error);
      onError?.(error);
      return null; // Or a default error component
    }
  }, [control, variation, variant, onError]);

  useEffect(() => {
    onVariantChosen?.(variant);
  }, [variant, onVariantChosen]);

  if (!chosenVariant && fallback === null) {
    console.warn('Both A/B test variants failed and no fallback provided.');
    return null; // Or a default error component
  }

  return (
    <div
      style={style}
      className={className}
      aria-label={ariaLabel}
      role="region"
    >
      {chosenVariant || fallback}
    </div>
  );
};

ABTest.displayName = 'ABTest'; // Helps with debugging

export default ABTest;

import React, { useState, useEffect, useMemo, CSSProperties } from 'react';

interface ABTestConfig {
  control: React.ReactNode;
  variation: React.ReactNode;
  weights?: { control: number; variation: number };
  storageKey?: string; // Key for persisting the chosen variant
}

interface ABTestProps extends ABTestConfig {
  onVariantChosen?: (variant: 'control' | 'variation') => void;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode; // What to render if both variants fail
  style?: CSSProperties; // Optional styling for the container
  className?: string; // Optional class name for the container
  'aria-label'?: string; // Accessibility label for the container
}

const useABTestVariant = (config: ABTestConfig): 'control' | 'variation' => {
  const { weights = { control: 0.5, variation: 0.5 }, storageKey } = config;

  const [variant, setVariant] = useState<'control' | 'variation'>(() => {
    if (storageKey) {
      const storedVariant = localStorage.getItem(storageKey);
      if (storedVariant === 'control' || storedVariant === 'variation') {
        return storedVariant;
      }
    }
    return Math.random() < weights.control ? 'control' : 'variation';
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, variant);
    }
  }, [variant, storageKey]);

  return variant;
};

const ABTest: React.FC<ABTestProps> = ({
  control,
  variation,
  weights,
  onVariantChosen,
  onError,
  fallback = null,
  storageKey,
  style,
  className,
  'aria-label': ariaLabel,
}) => {
  const variant = useABTestVariant({ control, variation, weights, storageKey });

  const chosenVariant = useMemo(() => {
    try {
      return variant === 'control' ? control : variation;
    } catch (error: any) {
      console.error('Error rendering variant:', error);
      onError?.(error);
      return null; // Or a default error component
    }
  }, [control, variation, variant, onError]);

  useEffect(() => {
    onVariantChosen?.(variant);
  }, [variant, onVariantChosen]);

  if (!chosenVariant && fallback === null) {
    console.warn('Both A/B test variants failed and no fallback provided.');
    return null; // Or a default error component
  }

  return (
    <div
      style={style}
      className={className}
      aria-label={ariaLabel}
      role="region"
    >
      {chosenVariant || fallback}
    </div>
  );
};

ABTest.displayName = 'ABTest'; // Helps with debugging

export default ABTest;