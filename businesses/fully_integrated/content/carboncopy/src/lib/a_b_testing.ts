import React, { useState, useEffect, useCallback, ReactNode } from 'react';

interface ContentVariant {
  title: string;
  description: string;
  weight: number; // Represents the probability weight of this variant
}

interface ABTestProps {
  variants: ContentVariant[];
  storageKey?: string; // Key to store the chosen variant in localStorage
  onVariantChosen?: (variant: ContentVariant) => void; // Callback when a variant is chosen
  fallbackVariant?: ContentVariant; // Variant to use if all others fail
  children: ReactNode;
}

const ABTest: React.FC<ABTestProps> = ({
  variants,
  storageKey = 'abTestVariant',
  onVariantChosen,
  fallbackVariant,
  children,
}) => {
  const [chosenVariant, setChosenVariant] = useState<ContentVariant | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const chooseVariant = useCallback((): ContentVariant | null => {
    if (!variants || variants.length === 0) {
      console.warn('No variants provided for A/B test. Using fallback if available.');
      return fallbackVariant || null;
    }

    try {
      // Check if a variant is already stored
      const storedVariantString = localStorage.getItem(storageKey);
      if (storedVariantString) {
        try {
          const storedVariant: ContentVariant = JSON.parse(storedVariantString);
          // Validate that the stored variant is actually one of the defined variants
          if (variants.some((v) => v.title === storedVariant.title && v.description === storedVariant.description)) {
            return storedVariant;
          } else {
            console.warn('Stored variant is invalid or outdated. Choosing a new variant.');
            localStorage.removeItem(storageKey); // Remove invalid variant
          }
        } catch (parseError) {
          console.error('Error parsing stored variant:', parseError);
          localStorage.removeItem(storageKey); // Remove potentially corrupted data
        }
      }

      // Weighted random selection
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      let randomValue = Math.random() * totalWeight;
      let selectedVariant: ContentVariant | undefined;

      for (const variant of variants) {
        randomValue -= variant.weight;
        if (randomValue <= 0) {
          selectedVariant = variant;
          break;
        }
      }

      if (!selectedVariant) {
        console.warn(
          'No variant selected. This should not happen if weights are correctly configured. Using first variant as fallback.'
        );
        selectedVariant = variants[0]; // Fallback to the first variant if something goes wrong
      }

      localStorage.setItem(storageKey, JSON.stringify(selectedVariant));
      return selectedVariant;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      console.error('Error choosing A/B test variant:', err);
      return fallbackVariant || null; // Return fallback if available, otherwise null
    }
  }, [variants, storageKey, fallbackVariant]);

  useEffect(() => {
    try {
      const variant = chooseVariant();
      setChosenVariant(variant);

      if (variant && onVariantChosen) {
        onVariantChosen(variant);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      console.error('Error in useEffect:', err);
    }
  }, [chooseVariant, onVariantChosen]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <p>Error loading content. Please try again later.</p>
        {/* Optionally display error details in development mode only */}
        {process.env.NODE_ENV === 'development' && <pre>{error.message}</pre>}
      </div>
    );
  }

  if (!chosenVariant) {
    return (
      <div aria-busy="true" aria-live="polite">
        <p>Loading content...</p>
      </div>
    ); // Or a loading spinner
  }

  // Render the children with the chosen variant's data
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        title: chosenVariant.title,
        description: chosenVariant.description,
      });
    }
    return child;
  });
};

interface MyComponentProps {
  title: string;
  description: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div data-testid="my-component">
      <h2 data-testid="title">{title}</h2>
      <p data-testid="description">{description}</p>
    </div>
  );
};

export { ABTest, MyComponent };

import React, { useState, useEffect, useCallback, ReactNode } from 'react';

interface ContentVariant {
  title: string;
  description: string;
  weight: number; // Represents the probability weight of this variant
}

interface ABTestProps {
  variants: ContentVariant[];
  storageKey?: string; // Key to store the chosen variant in localStorage
  onVariantChosen?: (variant: ContentVariant) => void; // Callback when a variant is chosen
  fallbackVariant?: ContentVariant; // Variant to use if all others fail
  children: ReactNode;
}

const ABTest: React.FC<ABTestProps> = ({
  variants,
  storageKey = 'abTestVariant',
  onVariantChosen,
  fallbackVariant,
  children,
}) => {
  const [chosenVariant, setChosenVariant] = useState<ContentVariant | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const chooseVariant = useCallback((): ContentVariant | null => {
    if (!variants || variants.length === 0) {
      console.warn('No variants provided for A/B test. Using fallback if available.');
      return fallbackVariant || null;
    }

    try {
      // Check if a variant is already stored
      const storedVariantString = localStorage.getItem(storageKey);
      if (storedVariantString) {
        try {
          const storedVariant: ContentVariant = JSON.parse(storedVariantString);
          // Validate that the stored variant is actually one of the defined variants
          if (variants.some((v) => v.title === storedVariant.title && v.description === storedVariant.description)) {
            return storedVariant;
          } else {
            console.warn('Stored variant is invalid or outdated. Choosing a new variant.');
            localStorage.removeItem(storageKey); // Remove invalid variant
          }
        } catch (parseError) {
          console.error('Error parsing stored variant:', parseError);
          localStorage.removeItem(storageKey); // Remove potentially corrupted data
        }
      }

      // Weighted random selection
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      let randomValue = Math.random() * totalWeight;
      let selectedVariant: ContentVariant | undefined;

      for (const variant of variants) {
        randomValue -= variant.weight;
        if (randomValue <= 0) {
          selectedVariant = variant;
          break;
        }
      }

      if (!selectedVariant) {
        console.warn(
          'No variant selected. This should not happen if weights are correctly configured. Using first variant as fallback.'
        );
        selectedVariant = variants[0]; // Fallback to the first variant if something goes wrong
      }

      localStorage.setItem(storageKey, JSON.stringify(selectedVariant));
      return selectedVariant;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      console.error('Error choosing A/B test variant:', err);
      return fallbackVariant || null; // Return fallback if available, otherwise null
    }
  }, [variants, storageKey, fallbackVariant]);

  useEffect(() => {
    try {
      const variant = chooseVariant();
      setChosenVariant(variant);

      if (variant && onVariantChosen) {
        onVariantChosen(variant);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      console.error('Error in useEffect:', err);
    }
  }, [chooseVariant, onVariantChosen]);

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <p>Error loading content. Please try again later.</p>
        {/* Optionally display error details in development mode only */}
        {process.env.NODE_ENV === 'development' && <pre>{error.message}</pre>}
      </div>
    );
  }

  if (!chosenVariant) {
    return (
      <div aria-busy="true" aria-live="polite">
        <p>Loading content...</p>
      </div>
    ); // Or a loading spinner
  }

  // Render the children with the chosen variant's data
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        title: chosenVariant.title,
        description: chosenVariant.description,
      });
    }
    return child;
  });
};

interface MyComponentProps {
  title: string;
  description: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div data-testid="my-component">
      <h2 data-testid="title">{title}</h2>
      <p data-testid="description">{description}</p>
    </div>
  );
};

export { ABTest, MyComponent };