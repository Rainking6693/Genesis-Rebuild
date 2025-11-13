import React from 'react';

type Props = {
  message: string;
  key?: string;
  className?: string;
  role?: string;
  dataTestid?: string;
};

const MyComponent: React.FC<Props> = ({ message, key = 'my-component-key', className, role, dataTestid }) => {
  return <div key={key} className={className} role={role} data-testid={dataTestid}>{message}</div>;
};

export { MyComponent };

import React from 'react';
import { MyComponent } from './MyComponent'; // Import the component

type AppProps = {};

const App: React.FC<AppProps> = () => {
  const message = 'Welcome to ReturnIQ';
  return <MyComponent message={message} key="app" className="app" role="banner" dataTestid="app" />;
};

export default App;

import React from 'react';
import { MyComponent } from './MyComponent'; // Import the component

const OtherComponent: React.FC = () => {
  return <MyComponent message="Welcome to Other Component" key="other-component" className="other-component" role="contentinfo" dataTestid="other-component" />;
};

export default OtherComponent;

import React from 'react';

type Props = {
  message: string;
  key?: string;
  className?: string;
  role?: string;
  dataTestid?: string;
};

const MyComponent: React.FC<Props> = ({ message, key = 'my-component-key', className, role, dataTestid }) => {
  return <div key={key} className={className} role={role} data-testid={dataTestid}>{message}</div>;
};

export { MyComponent };

import React from 'react';
import { MyComponent } from './MyComponent'; // Import the component

type AppProps = {};

const App: React.FC<AppProps> = () => {
  const message = 'Welcome to ReturnIQ';
  return <MyComponent message={message} key="app" className="app" role="banner" dataTestid="app" />;
};

export default App;

import React from 'react';
import { MyComponent } from './MyComponent'; // Import the component

const OtherComponent: React.FC = () => {
  return <MyComponent message="Welcome to Other Component" key="other-component" className="other-component" role="contentinfo" dataTestid="other-component" />;
};

export default OtherComponent;

// App.tsx

// OtherFile.tsx