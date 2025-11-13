import React, { FC, memo, DetailedHTMLProps } from 'react';
import { classNames } from '../../utilities/classNames';

type UsageAnalyticsProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  message: string;
  className?: string;
  ariaLabel?: string;
};

const UsageAnalytics: FC<UsageAnalyticsProps> = memo((props) => {
  const { message, className, ariaLabel, ...rest } = props;

  return (
    <div
      className={classNames('usage-analytics-message', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {message}
    </div>
  );
});

UsageAnalytics.defaultProps = {
  className: 'usage-analytics-message',
};

export default UsageAnalytics;

import React, { FC, memo, DetailedHTMLProps } from 'react';
import { classNames } from '../../utilities/classNames';

type UsageAnalyticsProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  message: string;
  className?: string;
  ariaLabel?: string;
};

const UsageAnalytics: FC<UsageAnalyticsProps> = memo((props) => {
  const { message, className, ariaLabel, ...rest } = props;

  return (
    <div
      className={classNames('usage-analytics-message', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      {message}
    </div>
  );
});

UsageAnalytics.defaultProps = {
  className: 'usage-analytics-message',
};

export default UsageAnalytics;