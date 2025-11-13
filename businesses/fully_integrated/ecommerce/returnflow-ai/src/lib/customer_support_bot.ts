import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
}

const CustomerSupportBot: FC<Props> = ({ className, message, children, ...rest }) => {
  const rootClasses = `customer-support-bot ${className || ''}`;

  // Add ARIA attributes for accessibility
  const ariaAttributes = {
    'aria-label': 'Customer Support Bot',
    role: 'region',
  };

  return (
    <div {...rest} {...ariaAttributes} className={rootClasses}>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
};

// Add error handling for missing or invalid props
CustomerSupportBot.defaultProps = {
  className: '',
  message: 'No message provided',
};

// Use named export for better modularity and easier testing
export { CustomerSupportBot };

In this updated version, I've added the ability to include additional content within the component using the `children` prop. I've also added ARIA attributes for better accessibility. Additionally, I've made the component more maintainable by separating the ARIA attributes from the main props.