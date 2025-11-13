import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Suspense } from 'react';
import { useLocation } from '@reach/router';
import { ThemeContext } from './ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import { Default404 } from './Default404';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  return <div className="message-container">{message}</div>;
};

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const AccessibleMyComponent: FC<Props> = (props) => {
  return (
    <div className="message-container" aria-label={props.message}>
      {props.message}
    </div>
  );
};

const SEO = (titleTemplate: string, description: string) => (
  <Helmet titleTemplate={titleTemplate} meta={{ description }} />
);

const WithSecurityAndPerformance = (
  WrappedComponent: FC<Props>,
  cspOptions: { defaultSrc: string; scriptSrc: string; styleSrc: string }
) => {
  return class extends React.Component {
    render() {
      const { pathname } = useLocation();

      return (
        <>
          <Helmet>
            <meta
              httpEquiv="Content-Security-Policy"
              content={`${cspOptions.defaultSrc} 'unsafe-inline' 'unsafe-eval' ${pathname}; ${cspOptions.scriptSrc} ${cspOptions.styleSrc}`}
            />
          </Helmet>
          <Suspense fallback={<div>Loading...</div>}>
            <WrappedComponent {...this.props} />
          </Suspense>
        </>
      );
    }
  };
};

const App = () => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);

  const [pathname, setPathname] = useState(useLocation().pathname);

  useEffect(() => {
    setPathname(useLocation().pathname);
  }, [useLocation().pathname]);

  const cspOptions = {
    defaultSrc: `'self'`,
    scriptSrc: `'self' 'unsafe-inline' 'unsafe-eval' ${pathname}`,
    styleSrc: `'self' 'unsafe-inline'`,
  };

  return (
    <>
      {/* Add SEO to the app */}
      <SEO titleTemplate="%s | MindShift Analytics" description="Welcome to MindShift Analytics" />

      {/* Render the accessible, secured, and performance-optimized MyComponent */}
      <ErrorBoundary fallback={<Default404 />}>
        <WithSecurityAndPerformance WrappedComponent={darkMode ? AccessibleMyComponent : MyComponent}>
          {(props) => <AccessibleMyComponent {...props} />}
        </WithSecurityAndPerformance>
      </ErrorBoundary>

      {/* Add dark mode toggle */}
      <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>
    </>
  );
};

export default App;

import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Suspense } from 'react';
import { useLocation } from '@reach/router';
import { ThemeContext } from './ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import { Default404 } from './Default404';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  return <div className="message-container">{message}</div>;
};

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const AccessibleMyComponent: FC<Props> = (props) => {
  return (
    <div className="message-container" aria-label={props.message}>
      {props.message}
    </div>
  );
};

const SEO = (titleTemplate: string, description: string) => (
  <Helmet titleTemplate={titleTemplate} meta={{ description }} />
);

const WithSecurityAndPerformance = (
  WrappedComponent: FC<Props>,
  cspOptions: { defaultSrc: string; scriptSrc: string; styleSrc: string }
) => {
  return class extends React.Component {
    render() {
      const { pathname } = useLocation();

      return (
        <>
          <Helmet>
            <meta
              httpEquiv="Content-Security-Policy"
              content={`${cspOptions.defaultSrc} 'unsafe-inline' 'unsafe-eval' ${pathname}; ${cspOptions.scriptSrc} ${cspOptions.styleSrc}`}
            />
          </Helmet>
          <Suspense fallback={<div>Loading...</div>}>
            <WrappedComponent {...this.props} />
          </Suspense>
        </>
      );
    }
  };
};

const App = () => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);

  const [pathname, setPathname] = useState(useLocation().pathname);

  useEffect(() => {
    setPathname(useLocation().pathname);
  }, [useLocation().pathname]);

  const cspOptions = {
    defaultSrc: `'self'`,
    scriptSrc: `'self' 'unsafe-inline' 'unsafe-eval' ${pathname}`,
    styleSrc: `'self' 'unsafe-inline'`,
  };

  return (
    <>
      {/* Add SEO to the app */}
      <SEO titleTemplate="%s | MindShift Analytics" description="Welcome to MindShift Analytics" />

      {/* Render the accessible, secured, and performance-optimized MyComponent */}
      <ErrorBoundary fallback={<Default404 />}>
        <WithSecurityAndPerformance WrappedComponent={darkMode ? AccessibleMyComponent : MyComponent}>
          {(props) => <AccessibleMyComponent {...props} />}
        </WithSecurityAndPerformance>
      </ErrorBoundary>

      {/* Add dark mode toggle */}
      <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>
    </>
  );
};

export default App;