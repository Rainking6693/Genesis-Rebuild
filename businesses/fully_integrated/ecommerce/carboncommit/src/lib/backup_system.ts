import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
  title?: string;
  error?: boolean;
}

const defaultClassName = 'backup-system-message';
const defaultStyle = { fontSize: '1.2rem', marginBottom: '1rem' };

const MyComponent: FC<Props> = ({ className, style, message, title, error, ...rest }) => {
  const combinedClassName = `${defaultClassName} ${className || ''}`;
  const combinedStyle = { ...defaultStyle, ...style };

  const ariaRole = error ? 'alert' : 'status';
  const ariaLabel = title ? `${title}: ${message}` : message;

  return (
    <div className={combinedClassName} style={combinedStyle} {...rest}>
      {title && <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>}
      <div role={ariaRole} aria-label={ariaLabel}>
        {message}
      </div>
    </div>
  );
};

MyComponent.defaultProps = {
  title: '',
  error: false,
};

export { MyComponent };

In this updated version, I've added a `title` prop to provide a more descriptive context for the message. I've also added an `error` prop to differentiate between error messages and informational messages, which can help with accessibility. The `aria-role` and `aria-label` properties have been updated accordingly. Additionally, I've added a `h3` element to display the title if provided. This improves the component's readability and accessibility.