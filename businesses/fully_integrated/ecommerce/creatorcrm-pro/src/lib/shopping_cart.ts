import React, { FC, useContext, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { SessionContext, SessionContextType } from './SessionContext';

interface Props {
  message: string;
}

const ShoppingCart: FC<Props> = ({ message }) => {
  return (
    <div className="shopping-cart-message" role="alert">
      {message}
      <button aria-label="Dismiss shopping cart message">X</button>
    </div>
  );
};

ShoppingCart.displayName = 'CreatorCRMProShoppingCart';

// Wrap ShoppingCart component with the secure session hook
const SecureShoppingCart: FC<Props> = (props) => {
  const { token, updateToken } = useContext(SessionContext);

  useEffect(() => {
    if (!token) {
      updateToken(null);
      window.location.href = '/login';
    }
  }, [token, updateToken]);

  if (!token) {
    return null;
  }

  return <ShoppingCart {...props} />;
};

// Create a custom SessionContext to manage user sessions
const SessionContext = React.createContext<SessionContextType>({
  token: null,
  updateToken: () => {},
});

// Use a custom hook to secure user sessions
const useSecureSession = () => {
  const [, , token] = React.useContext(Cookies).get('session');

  const [, , updateToken] = React.useContext(SessionContext);

  useEffect(() => {
    if (!token) {
      updateToken(null);
    }
  }, [token, updateToken]);

  return token;
};

// Use the custom hook in the SessionProvider component
const SessionProvider: FC = ({ children }) => {
  const token = useSecureSession();
  const [, , updateToken] = React.useState(token);

  return (
    <SessionContext.Provider value={{ token, updateToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SecureShoppingCart, SessionProvider };

import React, { FC, useContext, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { SessionContext, SessionContextType } from './SessionContext';

interface Props {
  message: string;
}

const ShoppingCart: FC<Props> = ({ message }) => {
  return (
    <div className="shopping-cart-message" role="alert">
      {message}
      <button aria-label="Dismiss shopping cart message">X</button>
    </div>
  );
};

ShoppingCart.displayName = 'CreatorCRMProShoppingCart';

// Wrap ShoppingCart component with the secure session hook
const SecureShoppingCart: FC<Props> = (props) => {
  const { token, updateToken } = useContext(SessionContext);

  useEffect(() => {
    if (!token) {
      updateToken(null);
      window.location.href = '/login';
    }
  }, [token, updateToken]);

  if (!token) {
    return null;
  }

  return <ShoppingCart {...props} />;
};

// Create a custom SessionContext to manage user sessions
const SessionContext = React.createContext<SessionContextType>({
  token: null,
  updateToken: () => {},
});

// Use a custom hook to secure user sessions
const useSecureSession = () => {
  const [, , token] = React.useContext(Cookies).get('session');

  const [, , updateToken] = React.useContext(SessionContext);

  useEffect(() => {
    if (!token) {
      updateToken(null);
    }
  }, [token, updateToken]);

  return token;
};

// Use the custom hook in the SessionProvider component
const SessionProvider: FC = ({ children }) => {
  const token = useSecureSession();
  const [, , updateToken] = React.useState(token);

  return (
    <SessionContext.Provider value={{ token, updateToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SecureShoppingCart, SessionProvider };