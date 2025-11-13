import React, { FC, useContext } from 'react';
import PropTypes from 'prop-types';
import JSXSafeString from 'jsx-safe-string';
import { AppContext } from './AppContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { sanitizeHTML } = useContext(AppContext);

  return <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(message) }} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

// AppContext.ts

import React from 'react';

interface AppContextData {
  sanitizeHTML: (html: string) => string;
}

const AppContext = React.createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC = ({ children }) => {
  const sanitizeHTML = (html: string) => {
    // Add your sanitization logic here
    // For example, using DOMPurify:
    // const sanitizedHTML = DOMPurify.sanitize(html);
    return html;
  };

  return (
    <AppContext.Provider value={{ sanitizeHTML }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

import React, { FC, useContext } from 'react';
import PropTypes from 'prop-types';
import JSXSafeString from 'jsx-safe-string';
import { AppContext } from './AppContext';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { sanitizeHTML } = useContext(AppContext);

  return <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(message) }} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

// AppContext.ts

import React from 'react';

interface AppContextData {
  sanitizeHTML: (html: string) => string;
}

const AppContext = React.createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC = ({ children }) => {
  const sanitizeHTML = (html: string) => {
    // Add your sanitization logic here
    // For example, using DOMPurify:
    // const sanitizedHTML = DOMPurify.sanitize(html);
    return html;
  };

  return (
    <AppContext.Provider value={{ sanitizeHTML }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);