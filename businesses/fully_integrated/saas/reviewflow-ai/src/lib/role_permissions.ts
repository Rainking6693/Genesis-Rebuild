import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface ReviewFlowMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const ReviewFlowMessage: React.FC<ReviewFlowMessageProps> = ({ message, children, className, ariaLabel, ...rest }) => {
  return (
    <div className={className} {...rest} aria-label={ariaLabel}>
      {message}
      {children}
    </div>
  );
};

ReviewFlowMessage.defaultProps = {
  className: '',
  ariaLabel: 'Review flow message',
};

export { ReviewFlowMessage };

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface ReviewFlowMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const ReviewFlowMessage: React.FC<ReviewFlowMessageProps> = ({ message, children, className, ariaLabel, ...rest }) => {
  return (
    <div className={className} {...rest} aria-label={ariaLabel}>
      {message}
      {children}
    </div>
  );
};

ReviewFlowMessage.defaultProps = {
  className: '',
  ariaLabel: 'Review flow message',
};

export { ReviewFlowMessage };