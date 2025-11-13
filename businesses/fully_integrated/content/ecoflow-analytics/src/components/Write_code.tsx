import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  // Use a more descriptive name for the prop to align with the business context
  businessName: string;
  // Allow for additional content within the component
  children?: ReactNode;
}

const EcoFlowAnalyticsComponent: FunctionComponent<Props> = ({ businessName, children, ...rest }) => {
  // Add a default value for businessName to handle edge cases
  const displayName = businessName || 'Business';

  // Use a semantic HTML element for the heading to improve accessibility
  return (
    <h2 {...rest}>
      Hello, {displayName}! Welcome to EcoFlow Analytics.
      {children}
    </h2>
  );

  // Add a fallback prop for React.createElement to improve resiliency
  // and allow for rendering the component in other environments
  return <React.Fragment>{React.createElement('h2', rest, `Hello, ${displayName}! Welcome to EcoFlow Analytics.`, children)}</React.Fragment>;
};

export default EcoFlowAnalyticsComponent;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  // Use a more descriptive name for the prop to align with the business context
  businessName: string;
  // Allow for additional content within the component
  children?: ReactNode;
}

const EcoFlowAnalyticsComponent: FunctionComponent<Props> = ({ businessName, children, ...rest }) => {
  // Add a default value for businessName to handle edge cases
  const displayName = businessName || 'Business';

  // Use a semantic HTML element for the heading to improve accessibility
  return (
    <h2 {...rest}>
      Hello, {displayName}! Welcome to EcoFlow Analytics.
      {children}
    </h2>
  );

  // Add a fallback prop for React.createElement to improve resiliency
  // and allow for rendering the component in other environments
  return <React.Fragment>{React.createElement('h2', rest, `Hello, ${displayName}! Welcome to EcoFlow Analytics.`, children)}</React.Fragment>;
};

export default EcoFlowAnalyticsComponent;