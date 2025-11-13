import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the ReportingEngine
  error?: boolean; // Flag for handling error messages differently
}

const ReportingEngine: FC<Props> = ({ className, message, children, error = false, ...rest }) => {
  const rootClassName = `sustainability-report ${className}${error ? ' error' : ''}`;

  return (
    <div {...rest} className={rootClassName}>
      {children || message}
    </div>
  );
};

ReportingEngine.displayName = 'CarbonCopyAI-ReportingEngine';

export default ReportingEngine;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the ReportingEngine
  error?: boolean; // Flag for handling error messages differently
}

const ReportingEngine: FC<Props> = ({ className, message, children, error = false, ...rest }) => {
  const rootClassName = `sustainability-report ${className}${error ? ' error' : ''}`;

  return (
    <div {...rest} className={rootClassName}>
      {children || message}
    </div>
  );
};

ReportingEngine.displayName = 'CarbonCopyAI-ReportingEngine';

export default ReportingEngine;