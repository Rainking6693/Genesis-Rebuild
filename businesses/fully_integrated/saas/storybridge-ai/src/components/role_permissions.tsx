import React, { createContext, useContext } from 'react';

interface AuthContextData {
  user: {
    role: string | null;
  };
}

interface Props {
  message: string;
}

// Create a custom type for the Higher Order Component (HOC)
type RoleBasedComponentType<T> = (props: T) => React.ReactElement | null;

// Create an AuthContext to store user information
const AuthContext = createContext<AuthContextData>({ user: { role: null } });

// Wrap the component with a Higher Order Component (HOC) to enforce role-based permissions
const RoleBasedComponent: RoleBasedComponentType<Props> = (WrappedComponent) => {
  const RoleBasedComponentWithFallback: RoleBasedComponentType<Props> = (props) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <AuthContext.Provider value={{ user: { role: null } }}>
        <div>Please log in to access this component</div>
      </AuthContext.Provider>;
    }

    if (ALLOWED_ROLES.includes(user.role)) {
      return <WrappedComponent {...props} />;
    }

    return <AuthContext.Provider value={{ user }}>
      <div>Access denied</div>
    </AuthContext.Provider>;
  };

  return RoleBasedComponentWithFallback;
};

// Add a constant for the allowed roles to access the component
const ALLOWED_ROLES = ['admin', 'marketing'];

// Create a default user with no role for initial rendering
const defaultUser = { role: null };

// Wrap the MyComponent with AuthContext.Provider to provide user context
const MyComponentWithAuthContext = () => {
  return (
    <AuthContext.Provider value={{ user: defaultUser }}>
      <RoleBasedComponent<Props> MyComponent />
    </AuthContext.Provider>
  );
};

export default MyComponentWithAuthContext;

import React, { createContext, useContext } from 'react';

interface AuthContextData {
  user: {
    role: string | null;
  };
}

interface Props {
  message: string;
}

// Create a custom type for the Higher Order Component (HOC)
type RoleBasedComponentType<T> = (props: T) => React.ReactElement | null;

// Create an AuthContext to store user information
const AuthContext = createContext<AuthContextData>({ user: { role: null } });

// Wrap the component with a Higher Order Component (HOC) to enforce role-based permissions
const RoleBasedComponent: RoleBasedComponentType<Props> = (WrappedComponent) => {
  const RoleBasedComponentWithFallback: RoleBasedComponentType<Props> = (props) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <AuthContext.Provider value={{ user: { role: null } }}>
        <div>Please log in to access this component</div>
      </AuthContext.Provider>;
    }

    if (ALLOWED_ROLES.includes(user.role)) {
      return <WrappedComponent {...props} />;
    }

    return <AuthContext.Provider value={{ user }}>
      <div>Access denied</div>
    </AuthContext.Provider>;
  };

  return RoleBasedComponentWithFallback;
};

// Add a constant for the allowed roles to access the component
const ALLOWED_ROLES = ['admin', 'marketing'];

// Create a default user with no role for initial rendering
const defaultUser = { role: null };

// Wrap the MyComponent with AuthContext.Provider to provide user context
const MyComponentWithAuthContext = () => {
  return (
    <AuthContext.Provider value={{ user: defaultUser }}>
      <RoleBasedComponent<Props> MyComponent />
    </AuthContext.Provider>
  );
};

export default MyComponentWithAuthContext;