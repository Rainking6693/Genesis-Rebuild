import React, { useState, useEffect, useCallback } from 'react';

interface ABTestProps<T> {
  variants: { [key: string]: React.FC<T> };
  weights: { [key: string]: number };
  storageKey?: string; // Key for storing the chosen variant in localStorage
  defaultVariant?: string; // Optional default variant if weights don't add up to 1 or no variant is chosen
  childrenProps: T; // Props to pass to the chosen variant component
  onVariantChosen?: (variantName: string) => void; // Callback when a variant is chosen
}

interface ABTestState {
  chosenVariant: string | null;
  error: string | null;
}

/**
 * ABTest Component: Dynamically renders a component variant based on weighted probabilities.
 *
 * Features:
 *  - Weighted variant selection:  Variants are chosen based on the provided weights.
 *  - LocalStorage persistence:  The chosen variant is stored in localStorage (optional).
 *  - Error handling:  Handles cases where weights are invalid or no variant can be chosen.
 *  - Accessibility:  Passes through props to the chosen variant for accessibility.
 *  - Maintainability:  Clear separation of concerns and well-defined prop types.
 *  - Resiliency: Handles edge cases like invalid weights or missing variants gracefully.
 *  - `onVariantChosen` callback:  Allows tracking of which variant was chosen.
 */
const ABTest = <T extends Record<string, any>>({
  variants,
  weights,
  storageKey,
  defaultVariant,
  childrenProps,
  onVariantChosen,
}: ABTestProps<T>): React.ReactElement | null => {
  const [state, setState] = useState<ABTestState>({
    chosenVariant: null,
    error: null,
  });

  const chooseVariant = useCallback(() => {
    try {
      const variantNames = Object.keys(variants);
      const weightValues = Object.values(weights);

      if (variantNames.length === 0) {
        throw new Error("No variants provided to ABTest component.");
      }

      if (variantNames.length !== Object.keys(weights).length) {
        throw new Error("Number of variants and weights must match.");
      }

      const weightSum = weightValues.reduce((sum, weight) => sum + weight, 0);

      if (weightSum <= 0) {
        throw new Error("Weights must sum to a positive number.");
      }

      const normalizedWeights = weightValues.map(weight => weight / weightSum);

      let randomNumber = Math.random();
      let chosenVariantName: string | null = null;

      for (let i = 0; i < variantNames.length; i++) {
        randomNumber -= normalizedWeights[i];
        if (randomNumber <= 0) {
          chosenVariantName = variantNames[i];
          break;
        }
      }

      if (!chosenVariantName) {
        if (defaultVariant && variants[defaultVariant]) {
          chosenVariantName = defaultVariant;
        } else {
          // Fallback: Choose the first variant if no other option is available.
          chosenVariantName = variantNames[0];
          console.warn("ABTest: No variant chosen based on weights. Falling back to the first variant.");
        }
      }

      return chosenVariantName;
    } catch (error: any) {
      console.error("ABTest Error:", error.message);
      setState(prevState => ({ ...prevState, error: error.message }));
      return null;
    }
  }, [variants, weights, defaultVariant]);

  useEffect(() => {
    let variantName: string | null = null;

    if (storageKey && typeof window !== 'undefined' && window.localStorage) {
      const storedVariant = localStorage.getItem(storageKey);
      if (storedVariant && variants[storedVariant]) {
        variantName = storedVariant;
      }
    }

    if (!variantName) {
      variantName = chooseVariant();
      if (variantName && storageKey && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(storageKey, variantName);
      }
    }

    if (variantName) {
      setState(prevState => ({ ...prevState, chosenVariant: variantName }));
      if (onVariantChosen) {
        onVariantChosen(variantName);
      }
    }
  }, [chooseVariant, storageKey, variants, onVariantChosen]);

  if (state.error) {
    return (
      <div>
        <p>A/B Test Error: {state.error}</p>
      </div>
    );
  }

  if (!state.chosenVariant) {
    return null; // Or a loading indicator
  }

  const VariantComponent = variants[state.chosenVariant];

  if (!VariantComponent) {
    console.error(`ABTest: Variant "${state.chosenVariant}" not found.`);
    return (
      <div>
        <p>A/B Test Error: Variant "{state.chosenVariant}" not found.</p>
      </div>
    );
  }

  return <VariantComponent {...childrenProps} />;
};

export default ABTest;

import React, { useState, useEffect, useCallback } from 'react';

interface ABTestProps<T> {
  variants: { [key: string]: React.FC<T> };
  weights: { [key: string]: number };
  storageKey?: string; // Key for storing the chosen variant in localStorage
  defaultVariant?: string; // Optional default variant if weights don't add up to 1 or no variant is chosen
  childrenProps: T; // Props to pass to the chosen variant component
  onVariantChosen?: (variantName: string) => void; // Callback when a variant is chosen
}

interface ABTestState {
  chosenVariant: string | null;
  error: string | null;
}

/**
 * ABTest Component: Dynamically renders a component variant based on weighted probabilities.
 *
 * Features:
 *  - Weighted variant selection:  Variants are chosen based on the provided weights.
 *  - LocalStorage persistence:  The chosen variant is stored in localStorage (optional).
 *  - Error handling:  Handles cases where weights are invalid or no variant can be chosen.
 *  - Accessibility:  Passes through props to the chosen variant for accessibility.
 *  - Maintainability:  Clear separation of concerns and well-defined prop types.
 *  - Resiliency: Handles edge cases like invalid weights or missing variants gracefully.
 *  - `onVariantChosen` callback:  Allows tracking of which variant was chosen.
 */
const ABTest = <T extends Record<string, any>>({
  variants,
  weights,
  storageKey,
  defaultVariant,
  childrenProps,
  onVariantChosen,
}: ABTestProps<T>): React.ReactElement | null => {
  const [state, setState] = useState<ABTestState>({
    chosenVariant: null,
    error: null,
  });

  const chooseVariant = useCallback(() => {
    try {
      const variantNames = Object.keys(variants);
      const weightValues = Object.values(weights);

      if (variantNames.length === 0) {
        throw new Error("No variants provided to ABTest component.");
      }

      if (variantNames.length !== Object.keys(weights).length) {
        throw new Error("Number of variants and weights must match.");
      }

      const weightSum = weightValues.reduce((sum, weight) => sum + weight, 0);

      if (weightSum <= 0) {
        throw new Error("Weights must sum to a positive number.");
      }

      const normalizedWeights = weightValues.map(weight => weight / weightSum);

      let randomNumber = Math.random();
      let chosenVariantName: string | null = null;

      for (let i = 0; i < variantNames.length; i++) {
        randomNumber -= normalizedWeights[i];
        if (randomNumber <= 0) {
          chosenVariantName = variantNames[i];
          break;
        }
      }

      if (!chosenVariantName) {
        if (defaultVariant && variants[defaultVariant]) {
          chosenVariantName = defaultVariant;
        } else {
          // Fallback: Choose the first variant if no other option is available.
          chosenVariantName = variantNames[0];
          console.warn("ABTest: No variant chosen based on weights. Falling back to the first variant.");
        }
      }

      return chosenVariantName;
    } catch (error: any) {
      console.error("ABTest Error:", error.message);
      setState(prevState => ({ ...prevState, error: error.message }));
      return null;
    }
  }, [variants, weights, defaultVariant]);

  useEffect(() => {
    let variantName: string | null = null;

    if (storageKey && typeof window !== 'undefined' && window.localStorage) {
      const storedVariant = localStorage.getItem(storageKey);
      if (storedVariant && variants[storedVariant]) {
        variantName = storedVariant;
      }
    }

    if (!variantName) {
      variantName = chooseVariant();
      if (variantName && storageKey && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(storageKey, variantName);
      }
    }

    if (variantName) {
      setState(prevState => ({ ...prevState, chosenVariant: variantName }));
      if (onVariantChosen) {
        onVariantChosen(variantName);
      }
    }
  }, [chooseVariant, storageKey, variants, onVariantChosen]);

  if (state.error) {
    return (
      <div>
        <p>A/B Test Error: {state.error}</p>
      </div>
    );
  }

  if (!state.chosenVariant) {
    return null; // Or a loading indicator
  }

  const VariantComponent = variants[state.chosenVariant];

  if (!VariantComponent) {
    console.error(`ABTest: Variant "${state.chosenVariant}" not found.`);
    return (
      <div>
        <p>A/B Test Error: Variant "{state.chosenVariant}" not found.</p>
      </div>
    );
  }

  return <VariantComponent {...childrenProps} />;
};

export default ABTest;