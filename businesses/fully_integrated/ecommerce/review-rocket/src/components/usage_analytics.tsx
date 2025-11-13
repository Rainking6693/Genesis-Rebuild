import React, { memo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, children }) => {
  return (
    <div
      data-testid="my-component"
      className="my-component"
      role="region"
      aria-label={title}
    >
      {title && (
        <h1
          data-testid="title"
          className="my-component__title"
          aria-label={title}
        >
          {title}
        </h1>
      )}
      {content && (
        <p
          data-testid="content"
          className="my-component__content"
          aria-describedby={title}
        >
          {content}
        </p>
      )}
      {children && (
        <div className="my-component__children" role="complementary">
          {children}
        </div>
      )}
    </div>
  );
});

export default MyComponent;

import React from 'react';
import MyComponent from './MyComponent';

const App: React.FC = () => {
  return (
    <div role="main">
      <MyComponent title="My Component" content="This is the content of my component." />
      <MyComponent>
        <p role="region">This is some additional content inside the component.</p>
      </MyComponent>
    </div>
  );
};

export default App;

import React, { memo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, children }) => {
  return (
    <div
      data-testid="my-component"
      className="my-component"
      role="region"
      aria-label={title}
    >
      {title && (
        <h1
          data-testid="title"
          className="my-component__title"
          aria-label={title}
        >
          {title}
        </h1>
      )}
      {content && (
        <p
          data-testid="content"
          className="my-component__content"
          aria-describedby={title}
        >
          {content}
        </p>
      )}
      {children && (
        <div className="my-component__children" role="complementary">
          {children}
        </div>
      )}
    </div>
  );
});

export default MyComponent;

import React from 'react';
import MyComponent from './MyComponent';

const App: React.FC = () => {
  return (
    <div role="main">
      <MyComponent title="My Component" content="This is the content of my component." />
      <MyComponent>
        <p role="region">This is some additional content inside the component.</p>
      </MyComponent>
    </div>
  );
};

export default App;