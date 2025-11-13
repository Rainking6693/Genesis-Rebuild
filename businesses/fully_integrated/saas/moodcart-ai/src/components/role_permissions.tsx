import React, { createContext, useContext, useState } from 'react';

interface Role {
  id: string;
  permissions: string[];
}

interface RoleContextData {
  role: Role | null;
  setRole: React.Dispatch<React.SetStateAction<Role | null>>;
}

const RoleContext = createContext<RoleContextData>({
  role: null,
  setRole: () => {},
});

const RoleProvider: React.FC = ({ children }) => {
  const [role, setRole] = useState<Role | null>(null);

  // Add a default role for better resiliency and edge cases
  const defaultRole: Role = {
    id: 'default',
    permissions: [],
  };

  return (
    <RoleContext.Provider value={{ role: role || defaultRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

interface Props {
  message: string;
}

const MoodCartComponent: React.FC<Props> = ({ message }) => {
  return <div>{message}</div>;
};

const RoleBasedComponent: React.FC<Props> = ({ message }) => {
  const { role } = useContext(RoleContext);

  // Check if the current user has the required permission
  const hasPermission = role?.permissions.includes('required_permission');

  // Add a fallback message for better accessibility
  const fallbackMessage = 'This content is restricted.';

  return hasPermission ? (
    <div>{message}</div>
  ) : (
    <div>{fallbackMessage}</div>
  );
};

export { MoodCartComponent, RoleBasedComponent };

// Usage example
import React from 'react';
import { RoleProvider } from './RoleBasedComponent';
import MoodCartComponent from './MoodCartComponent';
import RoleBasedComponent from './RoleBasedComponent';

const App = () => {
  return (
    <RoleProvider>
      <MoodCartComponent message="Public message" />
      <RoleBasedComponent message="Restricted message" />
    </RoleProvider>
  );
};

export default App;

import React, { createContext, useContext, useState } from 'react';

interface Role {
  id: string;
  permissions: string[];
}

interface RoleContextData {
  role: Role | null;
  setRole: React.Dispatch<React.SetStateAction<Role | null>>;
}

const RoleContext = createContext<RoleContextData>({
  role: null,
  setRole: () => {},
});

const RoleProvider: React.FC = ({ children }) => {
  const [role, setRole] = useState<Role | null>(null);

  // Add a default role for better resiliency and edge cases
  const defaultRole: Role = {
    id: 'default',
    permissions: [],
  };

  return (
    <RoleContext.Provider value={{ role: role || defaultRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

interface Props {
  message: string;
}

const MoodCartComponent: React.FC<Props> = ({ message }) => {
  return <div>{message}</div>;
};

const RoleBasedComponent: React.FC<Props> = ({ message }) => {
  const { role } = useContext(RoleContext);

  // Check if the current user has the required permission
  const hasPermission = role?.permissions.includes('required_permission');

  // Add a fallback message for better accessibility
  const fallbackMessage = 'This content is restricted.';

  return hasPermission ? (
    <div>{message}</div>
  ) : (
    <div>{fallbackMessage}</div>
  );
};

export { MoodCartComponent, RoleBasedComponent };

// Usage example
import React from 'react';
import { RoleProvider } from './RoleBasedComponent';
import MoodCartComponent from './MoodCartComponent';
import RoleBasedComponent from './RoleBasedComponent';

const App = () => {
  return (
    <RoleProvider>
      <MoodCartComponent message="Public message" />
      <RoleBasedComponent message="Restricted message" />
    </RoleProvider>
  );
};

export default App;