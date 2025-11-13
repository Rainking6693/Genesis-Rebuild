// my-component.tsx
import React, { ReactNode } from 'react';
import { EcoMetricsPro } from './eco-metrics-pro';
import PropTypes from 'prop-types';

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
}

const MyComponent: React.FC<Props> = ({ title = '', subtitle = '', content = '' }) => {
  const handleError = (e: React.ErrorEvent) => {
    console.error('Error occurred:', e);
  };

  const contentToRender: ReactNode = content ? (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      onError={handleError}
    />
  ) : null;

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {contentToRender}
      <footer>
        Powered by <a href={EcoMetricsPro.url}>{EcoMetricsPro.name}</a>
      </footer>
      <noscript>
        <p>
          This content requires JavaScript to be enabled. Please enable JavaScript and refresh the page.
        </p>
      </noscript>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
};

export default MyComponent;

// eco-metrics-pro.ts
export const EcoMetricsPro = {
  name: 'EcoMetricsPro',
  url: 'https://www.ecometricspro.com',
  defaultUrl: 'https://www.ecometricspro.com',
};

// my-component.tsx
import React, { ReactNode } from 'react';
import { EcoMetricsPro } from './eco-metrics-pro';
import PropTypes from 'prop-types';

interface Props {
  title?: string;
  subtitle?: string;
  content?: string;
}

const MyComponent: React.FC<Props> = ({ title = '', subtitle = '', content = '' }) => {
  const handleError = (e: React.ErrorEvent) => {
    console.error('Error occurred:', e);
  };

  const contentToRender: ReactNode = content ? (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      onError={handleError}
    />
  ) : null;

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      {contentToRender}
      <footer>
        Powered by <a href={EcoMetricsPro.url}>{EcoMetricsPro.name}</a>
      </footer>
      <noscript>
        <p>
          This content requires JavaScript to be enabled. Please enable JavaScript and refresh the page.
        </p>
      </noscript>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.string,
};

export default MyComponent;

// eco-metrics-pro.ts
export const EcoMetricsPro = {
  name: 'EcoMetricsPro',
  url: 'https://www.ecometricspro.com',
  defaultUrl: 'https://www.ecometricspro.com',
};