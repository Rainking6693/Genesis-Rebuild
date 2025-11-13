import React, { FC, PropsWithChildren, useContext, useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { TaxOptimizationSuggestion } from './TaxOptimizationSuggestion';
import { GlobalErrorContext } from './GlobalErrorContext';

const MyComponent: FC<PropsWithChildren<{ loadingMessage?: string }>> = ({ children, loadingMessage = 'Loading...' }) => {
  const [taxOptimizationSuggestions, setTaxOptimizationSuggestions] = useState<TaxOptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { setGlobalError } = useContext(GlobalErrorContext);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('https://api.example.com/tax-optimization-suggestions');
      const data = await response.json();
      setTaxOptimizationSuggestions(data);
      setLoading(false);
      setHasError(false);
    } catch (error) {
      console.error('Error fetching tax optimization suggestions:', error);
      setGlobalError(error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [setGlobalError]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  useLayoutEffect(() => {
    const debouncedFetchData = debounce(fetchData, 500);
    debouncedFetchData();
  }, [fetchData]);

  return (
    <div>
      {loading ? loadingMessage : children}
      {!loading && !hasError && taxOptimizationSuggestions.map((suggestion) => (
        <div key={suggestion.id}>{suggestion.description}</div>
      ))}
      {!loading && hasError && <div>An error occurred while fetching tax optimization suggestions.</div>}
    </div>
  );
};

export default MyComponent;

import React, { FC, PropsWithChildren, useContext, useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { TaxOptimizationSuggestion } from './TaxOptimizationSuggestion';
import { GlobalErrorContext } from './GlobalErrorContext';

const MyComponent: FC<PropsWithChildren<{ loadingMessage?: string }>> = ({ children, loadingMessage = 'Loading...' }) => {
  const [taxOptimizationSuggestions, setTaxOptimizationSuggestions] = useState<TaxOptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { setGlobalError } = useContext(GlobalErrorContext);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('https://api.example.com/tax-optimization-suggestions');
      const data = await response.json();
      setTaxOptimizationSuggestions(data);
      setLoading(false);
      setHasError(false);
    } catch (error) {
      console.error('Error fetching tax optimization suggestions:', error);
      setGlobalError(error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [setGlobalError]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  useLayoutEffect(() => {
    const debouncedFetchData = debounce(fetchData, 500);
    debouncedFetchData();
  }, [fetchData]);

  return (
    <div>
      {loading ? loadingMessage : children}
      {!loading && !hasError && taxOptimizationSuggestions.map((suggestion) => (
        <div key={suggestion.id}>{suggestion.description}</div>
      ))}
      {!loading && hasError && <div>An error occurred while fetching tax optimization suggestions.</div>}
    </div>
  );
};

export default MyComponent;