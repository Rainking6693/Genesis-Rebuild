import React, { FC, ReactNode, PropsWithChildren } from 'react';

type ReportingEngineProps = PropsWithChildren<{
  message: string;
  error?: Error;
}>;

const ReportingEngine: FC<ReportingEngineProps> = ({ children, message, error }) => {
  let content;

  if (error) {
    content = (
      <div role="alert">
        <h2 className="sr-only">An error occurred:</h2>
        <h2>An error occurred:</h2>
        <pre className="code">{error.message}</pre>
        <div className="message">{message}</div>
      </div>
    );
  } else {
    content = <div className="message">{message}</div>;
  }

  return (
    <div className="reporting-engine">
      {children}
      {content}
    </div>
  );
};

ReportingEngine.defaultProps = {
  error: null,
};

export default ReportingEngine;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

type ReportingEngineProps = PropsWithChildren<{
  message: string;
  error?: Error;
}>;

const ReportingEngine: FC<ReportingEngineProps> = ({ children, message, error }) => {
  let content;

  if (error) {
    content = (
      <div role="alert">
        <h2 className="sr-only">An error occurred:</h2>
        <h2>An error occurred:</h2>
        <pre className="code">{error.message}</pre>
        <div className="message">{message}</div>
      </div>
    );
  } else {
    content = <div className="message">{message}</div>;
  }

  return (
    <div className="reporting-engine">
      {children}
      {content}
    </div>
  );
};

ReportingEngine.defaultProps = {
  error: null,
};

export default ReportingEngine;