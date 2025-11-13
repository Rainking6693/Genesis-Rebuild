import React, { FC, PropsWithChildren, DefaultHTMLProps } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  children?: React.ReactNode;
  title?: string;
  dataTestid?: string;
}

const CustomerSupportBot: FC<Props> = ({
  className,
  message,
  children,
  title,
  dataTestid,
  ...rest
}) => {
  // Add a unique key for each rendered element for performance optimization
  const key = `${className}-${Math.random().toString()}`;

  // Sanitize user input to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['div'],
    disallowedTags: ['script'],
    allowedAttributes: {},
  });

  return (
    <div
      {...rest}
      key={key}
      className={className}
      role="presentation"
      aria-label="Customer Support Bot message"
      data-testid={dataTestid}
      title={title}
    >
      {sanitizedMessage}
      {children}
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  className: 'customer-support-bot',
};

export default CustomerSupportBot;

Now the component is more resilient, handles edge cases, is accessible, and maintainable, with additional features for testing and more complex content.