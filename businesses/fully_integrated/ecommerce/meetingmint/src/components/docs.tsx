// MyComponent.tsx
import React from 'react';
import { Props as MyComponentProps } from './MyComponent.props';

const MyComponent: React.FC<MyComponentProps> = ({ message, id = '', className = '', ...rest }) => {
  return (
    <div id={id} className={className} {...rest}>
      {message}
    </div>
  );
};

export interface Props {
  message: string;
  id?: string;
  className?: string;
  [key: string]: any; // Allow for additional props
}

export { MyComponent };

// MyComponent.props.ts
export interface Props {
  message: string;
  id?: string;
  className?: string;
  [key: string]: any; // Allow for additional props
}

// Docs.tsx
import React from 'react';
import { Props as DocsProps } from './Docs.props';
import MyComponent from './MyComponent';

const Docs: React.FC<DocsProps> = ({ title, component }) => {
  const { message, id, className, ...rest } = component;

  return (
    <div>
      <h1>{title}</h1>
      <MyComponent {...rest}>
        {message}
      </MyComponent>
    </div>
  );
};

export interface Props {
  title: string;
  component: MyComponent.Props;
}

export default Docs;

// Docs.props.ts
export interface Props {
  title: string;
  component: MyComponent.Props;
}

// MyComponent.tsx
import React from 'react';
import { Props as MyComponentProps } from './MyComponent.props';

const MyComponent: React.FC<MyComponentProps> = ({ message, id = '', className = '', ...rest }) => {
  return (
    <div id={id} className={className} {...rest}>
      {message}
    </div>
  );
};

export interface Props {
  message: string;
  id?: string;
  className?: string;
  [key: string]: any; // Allow for additional props
}

export { MyComponent };

// MyComponent.props.ts
export interface Props {
  message: string;
  id?: string;
  className?: string;
  [key: string]: any; // Allow for additional props
}

// Docs.tsx
import React from 'react';
import { Props as DocsProps } from './Docs.props';
import MyComponent from './MyComponent';

const Docs: React.FC<DocsProps> = ({ title, component }) => {
  const { message, id, className, ...rest } = component;

  return (
    <div>
      <h1>{title}</h1>
      <MyComponent {...rest}>
        {message}
      </MyComponent>
    </div>
  );
};

export interface Props {
  title: string;
  component: MyComponent.Props;
}

export default Docs;

// Docs.props.ts
export interface Props {
  title: string;
  component: MyComponent.Props;
}