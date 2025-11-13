import React from 'react';

interface ABTestingProps {
  title?: string;
  content?: string;
}

const ABTesting: React.FC<ABTestingProps> = ({ title, content }) => {
  return (
    <div
      data-testid="ab-testing-component"
      aria-live="polite"
      aria-atomic="true"
      role="region"
    >
      {title && (
        <h1
          data-testid="ab-testing-title"
          aria-label={title}
          className="ab-testing-title"
        >
          {title}
        </h1>
      )}
      {content && (
        <p
          data-testid="ab-testing-content"
          aria-label={content}
          className="ab-testing-content"
        >
          {content}
        </p>
      )}
      {!title && !content && (
        <div
          data-testid="ab-testing-empty"
          aria-label="No content available"
          className="ab-testing-empty"
        >
          No content available
        </div>
      )}
    </div>
  );
};

export default ABTesting;

import React from 'react';

interface ABTestingProps {
  title?: string;
  content?: string;
}

const ABTesting: React.FC<ABTestingProps> = ({ title, content }) => {
  return (
    <div
      data-testid="ab-testing-component"
      aria-live="polite"
      aria-atomic="true"
      role="region"
    >
      {title && (
        <h1
          data-testid="ab-testing-title"
          aria-label={title}
          className="ab-testing-title"
        >
          {title}
        </h1>
      )}
      {content && (
        <p
          data-testid="ab-testing-content"
          aria-label={content}
          className="ab-testing-content"
        >
          {content}
        </p>
      )}
      {!title && !content && (
        <div
          data-testid="ab-testing-empty"
          aria-label="No content available"
          className="ab-testing-empty"
        >
          No content available
        </div>
      )}
    </div>
  );
};

export default ABTesting;