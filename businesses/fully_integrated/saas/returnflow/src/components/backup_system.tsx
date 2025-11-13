import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component">
      {title && (
        <h1 className="my-component__title" aria-label={title}>
          {title}
        </h1>
      )}
      {content && (
        <p className="my-component__content" aria-label={content}>
          {content}
        </p>
      )}
      {!title && !content && (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default React.memo(MyComponent);

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component">
      {title && (
        <h1 className="my-component__title" aria-label={title}>
          {title}
        </h1>
      )}
      {content && (
        <p className="my-component__content" aria-label={content}>
          {content}
        </p>
      )}
      {!title && !content && (
        <div className="my-component__empty" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default React.memo(MyComponent);