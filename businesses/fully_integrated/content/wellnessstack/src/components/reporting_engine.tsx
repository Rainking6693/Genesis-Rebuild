import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface ReportMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the ReportMessage component
  isError?: boolean; // Flag for error messages to apply specific styling
}

const defaultClasses = 'report-message';
const errorClasses = 'report-message--error';

const ReportMessage: FC<ReportMessageProps> = ({ className, id, style, message, isError = false, ...rest }) => {
  const rootClasses = [defaultClasses, ...(isError ? [errorClasses] : [])];

  // Add aria-live attribute for screen reader accessibility
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div id={id} className={rootClasses.join(' ')} style={style} {...rest}>
      <div aria-live={ariaLive}>{message}</div>
      {/* Allow for additional content within the ReportMessage component */}
      {rest.children}
    </div>
  );
};

export default ReportMessage;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface ReportMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the ReportMessage component
  isError?: boolean; // Flag for error messages to apply specific styling
}

const defaultClasses = 'report-message';
const errorClasses = 'report-message--error';

const ReportMessage: FC<ReportMessageProps> = ({ className, id, style, message, isError = false, ...rest }) => {
  const rootClasses = [defaultClasses, ...(isError ? [errorClasses] : [])];

  // Add aria-live attribute for screen reader accessibility
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div id={id} className={rootClasses.join(' ')} style={style} {...rest}>
      <div aria-live={ariaLive}>{message}</div>
      {/* Allow for additional content within the ReportMessage component */}
      {rest.children}
    </div>
  );
};

export default ReportMessage;