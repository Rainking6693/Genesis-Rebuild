import React, { useState, ReactElement } from 'react';

interface ReportingComponentProps {
  message: string;
}

const ReportingComponent: React.FC<ReportingComponentProps> = ({ message }) => {
  return (
    <div key="reporting-component" data-testid="reporting-component" className="reporting-component">
      <h2>{message}</h2>
      <a href="#" aria-label="Copy to clipboard" title="Copy to clipboard">
        Copy
      </a>
    </div>
  );
};

ReportingComponent.displayName = 'ReportingComponent';

const ErrorReportingComponent: React.FC<ReportingComponentProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    if (navigator.clipboard && message.length > 0) {
      navigator.clipboard.writeText(message);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div key="error-reporting-component" data-testid="error-reporting-component" className="error-reporting-component">
      <h2>Error: {message}</h2>
      <p>
        {copied ? 'Copied to clipboard!' : 'Click to copy error message'}
      </p>
      <a href="#" onClick={handleCopyClick} aria-label={`Copy error message: ${message}`} title="Copy error message">
        {copied ? 'Copied!' : 'Copy'}
      </a>
    </div>
  );
};

ErrorReportingComponent.displayName = 'ErrorReportingComponent';

// Keep the second component with the same name and interface as the first one
// for consistency and maintainability
import React from 'react';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return <div key={message} data-testid="my-component">{message}</div>;
};

export default MyComponent;

import React, { useState, ReactElement } from 'react';

interface ReportingComponentProps {
  message: string;
}

const ReportingComponent: React.FC<ReportingComponentProps> = ({ message }) => {
  return (
    <div key="reporting-component" data-testid="reporting-component" className="reporting-component">
      <h2>{message}</h2>
      <a href="#" aria-label="Copy to clipboard" title="Copy to clipboard">
        Copy
      </a>
    </div>
  );
};

ReportingComponent.displayName = 'ReportingComponent';

const ErrorReportingComponent: React.FC<ReportingComponentProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    if (navigator.clipboard && message.length > 0) {
      navigator.clipboard.writeText(message);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div key="error-reporting-component" data-testid="error-reporting-component" className="error-reporting-component">
      <h2>Error: {message}</h2>
      <p>
        {copied ? 'Copied to clipboard!' : 'Click to copy error message'}
      </p>
      <a href="#" onClick={handleCopyClick} aria-label={`Copy error message: ${message}`} title="Copy error message">
        {copied ? 'Copied!' : 'Copy'}
      </a>
    </div>
  );
};

ErrorReportingComponent.displayName = 'ErrorReportingComponent';

// Keep the second component with the same name and interface as the first one
// for consistency and maintainability
import React from 'react';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  return <div key={message} data-testid="my-component">{message}</div>;
};

export default MyComponent;