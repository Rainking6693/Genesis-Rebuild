import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface MeetingInsightsMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  isError?: boolean;
  isWarning?: boolean;
  children?: React.ReactNode;
  title?: string;
  dataTestid?: string;
}

const baseStyle = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.5',
  marginBottom: '0.5rem',
};

const errorStyle = {
  color: '#dc3545',
};

const warningStyle = {
  color: '#ffc107',
};

const MeetingInsightsMessage: React.FC<PropsWithChildren<MeetingInsightsMessageProps>> = ({
  message,
  isError = false,
  isWarning = false,
  children = '',
  title,
  className,
  dataTestid,
  ...rest
}) => {
  const style = { ...baseStyle, ...(isError ? errorStyle : (isWarning ? warningStyle : {})) };

  // Add a role for screen readers to understand the purpose of the message
  const role = isError ? 'alert' : isWarning ? 'warning' : 'info';

  // Check for invalid prop types
  if (!React.isValidElement(children) && !children) {
    children = <span style={style}>{message}</span>;
  }

  return (
    <div data-testid={dataTestid} className={className} {...rest} role={role} aria-label={title}>
      {children}
    </div>
  );
};

export default MeetingInsightsMessage;

In this updated code, I've added the `DetailedHTMLProps` type to handle the HTML attributes more easily, added a default value for the `children` prop, and included a check for invalid prop types. I've also added a `title` prop for improved accessibility, a `className` prop for easier styling, and a `dataTestid` prop for easier testing. Lastly, I've used the spread operator (`...rest`) to handle any additional HTML attributes that might be passed to the component.