import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface UsageAnalyticsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ message, children, className, ...rest }) => {
  const finalClassName = className ? `${className} usage-analytics` : 'usage-analytics';

  return (
    <div className={finalClassName} {...rest} aria-label="Usage Analytics">
      {message && <span className="usage-analytics__message">{message}</span>}
      {children}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

export default UsageAnalytics;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface UsageAnalyticsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ message, children, className, ...rest }) => {
  const finalClassName = className ? `${className} usage-analytics` : 'usage-analytics';

  return (
    <div className={finalClassName} {...rest} aria-label="Usage Analytics">
      {message && <span className="usage-analytics__message">{message}</span>}
      {children}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

export default UsageAnalytics;