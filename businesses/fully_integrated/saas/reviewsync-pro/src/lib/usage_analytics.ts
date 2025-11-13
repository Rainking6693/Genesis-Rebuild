import React, { PropsWithChildren, ReactNode } from 'react';

/**
 * Props interface for UsageAnalytics component
 */
interface Props {
  /**
   * Analytics message to be displayed
   */
  analyticsMessage: ReactNode;

  /**
   * Optional className for custom styling
   */
  className?: string;

  /**
   * Optional 'aria-label' for accessibility
   */
  ariaLabel?: string;
}

/**
 * UsageAnalytics component
 * Renders the analytics message with optional custom styling and accessibility support
 */
const UsageAnalytics: React.FC<Props> = ({ analyticsMessage, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {analyticsMessage}
    </div>
  );
};

/**
 * Default styles for UsageAnalytics component
 */
const defaultStyles = `
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
`;

/**
 * WithDefaultStyles Higher Order Component (HOC)
 * Applies default styles to UsageAnalytics component if no custom className is provided
 */
const WithDefaultStyles = (WrappedComponent: React.FC<Props>) => {
  return (props: Props) => {
    const { className, ...rest } = props;
    return (
      <div className={`${defaultStyles} ${className}`} {...rest}>
        <WrappedComponent {...rest} />
      </div>
    );
  };
};

/**
 * UsageAnalyticsWithDefaultStyles component with default styles and accessibility support
 */
const UsageAnalyticsWithDefaultStyles = WithDefaultStyles(UsageAnalytics);

UsageAnalyticsWithDefaultStyles.defaultProps = {
  ariaLabel: 'Usage Analytics',
};

export { UsageAnalyticsWithDefaultStyles };

import React, { PropsWithChildren, ReactNode } from 'react';

/**
 * Props interface for UsageAnalytics component
 */
interface Props {
  /**
   * Analytics message to be displayed
   */
  analyticsMessage: ReactNode;

  /**
   * Optional className for custom styling
   */
  className?: string;

  /**
   * Optional 'aria-label' for accessibility
   */
  ariaLabel?: string;
}

/**
 * UsageAnalytics component
 * Renders the analytics message with optional custom styling and accessibility support
 */
const UsageAnalytics: React.FC<Props> = ({ analyticsMessage, className, ariaLabel }) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      {analyticsMessage}
    </div>
  );
};

/**
 * Default styles for UsageAnalytics component
 */
const defaultStyles = `
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
`;

/**
 * WithDefaultStyles Higher Order Component (HOC)
 * Applies default styles to UsageAnalytics component if no custom className is provided
 */
const WithDefaultStyles = (WrappedComponent: React.FC<Props>) => {
  return (props: Props) => {
    const { className, ...rest } = props;
    return (
      <div className={`${defaultStyles} ${className}`} {...rest}>
        <WrappedComponent {...rest} />
      </div>
    );
  };
};

/**
 * UsageAnalyticsWithDefaultStyles component with default styles and accessibility support
 */
const UsageAnalyticsWithDefaultStyles = WithDefaultStyles(UsageAnalytics);

UsageAnalyticsWithDefaultStyles.defaultProps = {
  ariaLabel: 'Usage Analytics',
};

export { UsageAnalyticsWithDefaultStyles };