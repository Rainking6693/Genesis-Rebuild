import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { EcoFlowAnalyticsBranding } from '../../branding';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  message: string;
  children?: ReactNode;
}

const MyComponent: React.FC<Props> = ({ title, subtitle, message, children, className, ...rest }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return (
    <div
      className={className}
      {...rest}
      onKeyDown={handleKeyDown}
      role="region"
      aria-labelledby="title-id subtitle-id"
    >
      <EcoFlowAnalyticsBranding />
      <h1 id="title-id">{title}</h1>
      {subtitle && <h2 id="subtitle-id">{subtitle}</h2>}
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { EcoFlowAnalyticsBranding } from '../../branding';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  message: string;
  children?: ReactNode;
}

const MyComponent: React.FC<Props> = ({ title, subtitle, message, children, className, ...rest }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return (
    <div
      className={className}
      {...rest}
      onKeyDown={handleKeyDown}
      role="region"
      aria-labelledby="title-id subtitle-id"
    >
      <EcoFlowAnalyticsBranding />
      <h1 id="title-id">{title}</h1>
      {subtitle && <h2 id="subtitle-id">{subtitle}</h2>}
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyComponent;