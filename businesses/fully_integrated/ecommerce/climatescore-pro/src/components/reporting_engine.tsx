import React, { FC, useContext, useReducer, UseStateOptions } from 'react';
import { ReportingEngineContext } from './ReportingEngineContext';

interface Props {
  message?: string;
}

interface ReportingEngineState {
  message: string;
  error?: Error;
}

interface ReportingEngineAction {
  type: 'UPDATE_MESSAGE' | 'SET_ERROR';
  payload: string | Error;
}

const reportingEngineReducer = (state: ReportingEngineState, action: ReportingEngineAction): ReportingEngineState => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const ReportingEngine: FC<Props> = ({ message }) => {
  const [state, dispatch] = useReducer(reportingEngineReducer, { message: '' });

  const updateMessage = (newMessage: string, options?: UseStateOptions<string>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: newMessage });
  };

  const setError = (error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <div className="report-container">
      {state.message && <div>{state.message}</div>}
      {state.error && (
        <ReportingEngine.errorComponent error={state.error} />
      )}
    </div>
  );
};

ReportingEngine.defaultProps = {
  message: 'This is the default report message.',
};

ReportingEngine.errorComponent = ({ error }) => {
  console.error(error);
  return (
    <div className="error-container">
      <span className="sr-only">An error occurred:</span>
      <code className="error-message">{error.message}</code>
    </div>
  );
};

// Use Context API for better component composition and state management
const ReportingEngineContext = React.createContext<{
  state: ReportingEngineState;
  updateMessage: (newMessage: string, options?: UseStateOptions<string>) => void;
  setError: (error: Error) => void;
}>({ state: { message: '' }, updateMessage: () => {}, setError: () => {} });

const ReportingEngineWithContext: FC<Props> = ({ message }) => {
  const [state, updateMessage] = useReducer(reportingEngineReducer, { message });
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      updateMessage('An error occurred: ' + error.message, { force: true });
    }
  }, [error, updateMessage]);

  return (
    <ReportingEngineContext.Provider value={{ state, updateMessage, setError }}>
      <div className="report-container">{state.message}</div>
    </ReportingEngineContext.Provider>
  );
};

ReportingEngineWithContext.defaultProps = {
  message: 'This is the default report message.',
};

export { ReportingEngine, ReportingEngineContext };
export default ReportingEngineWithContext;

import React, { FC, useContext, useReducer, UseStateOptions } from 'react';
import { ReportingEngineContext } from './ReportingEngineContext';

interface Props {
  message?: string;
}

interface ReportingEngineState {
  message: string;
  error?: Error;
}

interface ReportingEngineAction {
  type: 'UPDATE_MESSAGE' | 'SET_ERROR';
  payload: string | Error;
}

const reportingEngineReducer = (state: ReportingEngineState, action: ReportingEngineAction): ReportingEngineState => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const ReportingEngine: FC<Props> = ({ message }) => {
  const [state, dispatch] = useReducer(reportingEngineReducer, { message: '' });

  const updateMessage = (newMessage: string, options?: UseStateOptions<string>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: newMessage });
  };

  const setError = (error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <div className="report-container">
      {state.message && <div>{state.message}</div>}
      {state.error && (
        <ReportingEngine.errorComponent error={state.error} />
      )}
    </div>
  );
};

ReportingEngine.defaultProps = {
  message: 'This is the default report message.',
};

ReportingEngine.errorComponent = ({ error }) => {
  console.error(error);
  return (
    <div className="error-container">
      <span className="sr-only">An error occurred:</span>
      <code className="error-message">{error.message}</code>
    </div>
  );
};

// Use Context API for better component composition and state management
const ReportingEngineContext = React.createContext<{
  state: ReportingEngineState;
  updateMessage: (newMessage: string, options?: UseStateOptions<string>) => void;
  setError: (error: Error) => void;
}>({ state: { message: '' }, updateMessage: () => {}, setError: () => {} });

const ReportingEngineWithContext: FC<Props> = ({ message }) => {
  const [state, updateMessage] = useReducer(reportingEngineReducer, { message });
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      updateMessage('An error occurred: ' + error.message, { force: true });
    }
  }, [error, updateMessage]);

  return (
    <ReportingEngineContext.Provider value={{ state, updateMessage, setError }}>
      <div className="report-container">{state.message}</div>
    </ReportingEngineContext.Provider>
  );
};

ReportingEngineWithContext.defaultProps = {
  message: 'This is the default report message.',
};

export { ReportingEngine, ReportingEngineContext };
export default ReportingEngineWithContext;