import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component">
      {title ? (
        <h1 className="my-component__title" aria-label={title}>
          {title}
        </h1>
      ) : content ? (
        <div className="my-component__empty" aria-label="No title available">
          No title available
        </div>
      ) : null}
      {content ? (
        <p className="my-component__content" aria-label={content}>
          {content}
        </p>
      ) : title ? (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      ) : (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component">
      {title ? (
        <h1 className="my-component__title" aria-label={title}>
          {title}
        </h1>
      ) : content ? (
        <div className="my-component__empty" aria-label="No title available">
          No title available
        </div>
      ) : null}
      {content ? (
        <p className="my-component__content" aria-label={content}>
          {content}
        </p>
      ) : title ? (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      ) : (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default MyComponent;