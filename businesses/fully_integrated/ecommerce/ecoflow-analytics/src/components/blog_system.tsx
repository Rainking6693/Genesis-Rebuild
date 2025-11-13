import React, { PropsWithChildren, ReactNode, DefaultHTMLProps, RefObject } from 'react';
import { EcoFlowAnalytics } from '../../../constants';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  children?: ReactNode;
}

// Added a defaultProps object to handle missing props
const defaultProps = {
  title: '',
  subtitle: '',
  content: '',
};

// Extended Props interface to include defaultProps
type ExtendedProps = Props & typeof defaultProps;

// Changed MyComponent to accept PropsWithChildren for more flexibility
const MyComponent: React.FC<ExtendedProps> = ({
  title,
  subtitle,
  content,
  children,
  ...rest
}: PropsWithChildren<ExtendedProps>) => {
  // Added a check for children to ensure they are provided
  if (!children) return <div />;

  // Added role and aria-label for accessibility
  const footerAriaLabel = `Powered by ${EcoFlowAnalytics.name}`;

  return (
    <div {...rest}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
      <footer role="contentinfo">
        <a href={EcoFlowAnalytics.website} aria-label={footerAriaLabel}>
          {EcoFlowAnalytics.name}
        </a>
      </footer>
    </div>
  );
};

// Added a displayName for easier debugging
MyComponent.displayName = 'MyComponent';

// Added a forwardRef for potential use with React.forwardRef in the future
const forwardedMyComponent = React.forwardRef((props: Props, ref: RefObject<HTMLDivElement>) => (
  <MyComponent {...props} ref={ref} />
));

export default forwardedMyComponent;

import React, { PropsWithChildren, ReactNode, DefaultHTMLProps, RefObject } from 'react';
import { EcoFlowAnalytics } from '../../../constants';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  children?: ReactNode;
}

// Added a defaultProps object to handle missing props
const defaultProps = {
  title: '',
  subtitle: '',
  content: '',
};

// Extended Props interface to include defaultProps
type ExtendedProps = Props & typeof defaultProps;

// Changed MyComponent to accept PropsWithChildren for more flexibility
const MyComponent: React.FC<ExtendedProps> = ({
  title,
  subtitle,
  content,
  children,
  ...rest
}: PropsWithChildren<ExtendedProps>) => {
  // Added a check for children to ensure they are provided
  if (!children) return <div />;

  // Added role and aria-label for accessibility
  const footerAriaLabel = `Powered by ${EcoFlowAnalytics.name}`;

  return (
    <div {...rest}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
      <footer role="contentinfo">
        <a href={EcoFlowAnalytics.website} aria-label={footerAriaLabel}>
          {EcoFlowAnalytics.name}
        </a>
      </footer>
    </div>
  );
};

// Added a displayName for easier debugging
MyComponent.displayName = 'MyComponent';

// Added a forwardRef for potential use with React.forwardRef in the future
const forwardedMyComponent = React.forwardRef((props: Props, ref: RefObject<HTMLDivElement>) => (
  <MyComponent {...props} ref={ref} />
));

export default forwardedMyComponent;