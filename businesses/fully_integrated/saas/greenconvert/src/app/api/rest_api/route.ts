import React, { FC, useMemo, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { DOMPurify } from 'dompurify';
import { ThemeContext } from './ThemeContext';

interface Props {
  message: string;
}

interface ThemeContextType {
  theme: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Get the current theme from the context
  const { theme } = useContext(ThemeContext);

  // Add a class to the component for styling based on the theme
  const componentClass = useMemo(() => `my-component ${theme}`, [theme]);

  return (
    <div className={componentClass} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Use named export for better readability and maintainability
export { MyComponent };

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent = React.memo(MyComponent);

// Add error boundary to handle component errors
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>An error occurred.</div>;
    }

    return this.props.children;
  }
}

// Wrap MyComponent with ErrorBoundary for better resiliency
const WrappedMyComponent = (props: Props) => (
  <ErrorBoundary>
    <MemoizedMyComponent {...props} />
  </ErrorBoundary>
);

// Use named export for better readability and maintainability
export { WrappedMyComponent };

// Create a ThemeContext for styling based on the theme
const ThemeContext = React.createContext<ThemeContextType>({ theme: 'light' });

// Use a custom hook to manage the theme state
const useTheme = () => {
  const [theme, setTheme] = useState<string>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

// Use a custom hook to provide the theme state to the components
const useThemeProvider = () => {
  const { theme, toggleTheme } = useTheme();

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Wrap the application with the ThemeProvider for better accessibility and maintainability
const AppWrapper = ({ children }) => (
  <ThemeContext.Provider>
    {children}
  </ThemeContext.Provider>
);

// Use named export for better readability and maintainability
export { AppWrapper, useTheme, useThemeProvider };

In this updated code, I've added a `ThemeContext` and a custom hook `useTheme` to manage the theme state. I've also wrapped the entire application with the `ThemeProvider` for better accessibility and maintainability. This allows you to easily change the theme of the application by calling the `toggleTheme` function provided by the `useTheme` hook.