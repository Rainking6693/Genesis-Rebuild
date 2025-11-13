import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { classNames } from '@carboncommit/shared-components';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  className?: string;
  dataTestid?: string;
}

const UsageAnalytics: FC<Props> = ({ message, children, className, dataTestid, ...rest }) => {
  const finalClassName = classNames('usage-analytics-message', className);

  return (
    <div data-testid={dataTestid} role="region" aria-label="Usage Analytics" {...rest} className={finalClassName} style={{
      minWidth: '300px',
      display: 'block',
      margin: '1rem 0',
      padding: '1rem'
    }}>
      {message}
      {children}
    </div>
  );
};

export default UsageAnalytics;

This updated component now includes a `data-testid` attribute for easier testing, a `role` attribute to make it accessible as a `region`, an `aria-label` attribute to provide a descriptive label for screen readers, and various styles to improve its appearance and layout. Additionally, it accepts any HTML attributes as props, making it more flexible and maintainable.