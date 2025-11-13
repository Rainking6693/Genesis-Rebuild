import React, { FC, useContext, useState } from 'react';
import { ExpenseData, TaxOptimization } from 'expense-data-and-tax-optimization-library';
import { ErrorContext, ErrorContextValue } from './ErrorContext';

interface Props {
  message: string;
}

interface ReportingEngineContextValue {
  generateReport: (expenseData: ExpenseData) => void;
  error: string | null;
}

const ReportingEngineContext = React.createContext<ReportingEngineContextValue>({
  generateReport: () => {},
  error: null,
});

const ReportingEngine: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const { setGlobalError } = useContext(ErrorContext);
  const { generateReport } = useContext(ReportingEngineContext);

  const handleGenerateReport = (expenseData: ExpenseData) => {
    let optimizedReport: any;
    try {
      optimizedReport = TaxOptimization.optimize(expenseData);
      // ...
    } catch (error) {
      setError(error.message);
      setGlobalError(error.message);
    }

    if (optimizedReport) {
      // Handle the optimized report here
    }
  };

  return (
    <ReportingEngineContext.Provider value={{ generateReport: handleGenerateReport, error }}>
      <div>{message}</div>
    </ReportingEngineContext.Provider>
  );
};

ReportingEngine.displayName = 'ReportingEngine';

// Wrap ReportingEngine with ErrorBoundary to handle errors
const ErrorBoundary = ({ children }) => {
  const { error, setGlobalError } = useContext(ErrorContext);

  const handleError = (error) => {
    setGlobalError(error.message);
  };

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      {children}
    </div>
  );
};

ErrorBoundary.displayName = 'ErrorBoundary';
ErrorBoundary.getDerivedStateFromError = handleError;
ErrorBoundary.getDerivedStateFromProps = () => ({});

export const ReportingEngineWithErrorBoundary = () => (
  <ErrorContext.Provider value={{} as ErrorContextValue}>
    <ReportingEngineContext.Provider value={{ generateReport: () => {}, error: null }}>
      <ErrorBoundary>
        <ReportingEngine message="Tax-optimized reports generator" />
      </ErrorBoundary>
    </ReportingEngineContext.Provider>
  </ErrorContext.Provider>
);

export default ReportingEngine;

import React, { FC, useContext, useState } from 'react';
import { ExpenseData, TaxOptimization } from 'expense-data-and-tax-optimization-library';
import { ErrorContext, ErrorContextValue } from './ErrorContext';

interface Props {
  message: string;
}

interface ReportingEngineContextValue {
  generateReport: (expenseData: ExpenseData) => void;
  error: string | null;
}

const ReportingEngineContext = React.createContext<ReportingEngineContextValue>({
  generateReport: () => {},
  error: null,
});

const ReportingEngine: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const { setGlobalError } = useContext(ErrorContext);
  const { generateReport } = useContext(ReportingEngineContext);

  const handleGenerateReport = (expenseData: ExpenseData) => {
    let optimizedReport: any;
    try {
      optimizedReport = TaxOptimization.optimize(expenseData);
      // ...
    } catch (error) {
      setError(error.message);
      setGlobalError(error.message);
    }

    if (optimizedReport) {
      // Handle the optimized report here
    }
  };

  return (
    <ReportingEngineContext.Provider value={{ generateReport: handleGenerateReport, error }}>
      <div>{message}</div>
    </ReportingEngineContext.Provider>
  );
};

ReportingEngine.displayName = 'ReportingEngine';

// Wrap ReportingEngine with ErrorBoundary to handle errors
const ErrorBoundary = ({ children }) => {
  const { error, setGlobalError } = useContext(ErrorContext);

  const handleError = (error) => {
    setGlobalError(error.message);
  };

  return (
    <div>
      {error && <div role="alert">{error}</div>}
      {children}
    </div>
  );
};

ErrorBoundary.displayName = 'ErrorBoundary';
ErrorBoundary.getDerivedStateFromError = handleError;
ErrorBoundary.getDerivedStateFromProps = () => ({});

export const ReportingEngineWithErrorBoundary = () => (
  <ErrorContext.Provider value={{} as ErrorContextValue}>
    <ReportingEngineContext.Provider value={{ generateReport: () => {}, error: null }}>
      <ErrorBoundary>
        <ReportingEngine message="Tax-optimized reports generator" />
      </ErrorBoundary>
    </ReportingEngineContext.Provider>
  </ErrorContext.Provider>
);

export default ReportingEngine;