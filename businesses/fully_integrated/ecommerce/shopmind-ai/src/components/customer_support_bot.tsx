import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { sanitize } from 'defensics';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  title?: string;
  role?: string;
  'aria-*'?: React.HTMLAttributes['aria-*'];
  dataTestid?: string;
}

const CustomerSupportBot: FC<Props> = ({
  className,
  message,
  title,
  role,
  'aria-*': ariaProps,
  dataTestid = 'customer-support-bot',
  ...rest
}) => {
  const sanitizedMessage = CustomerSupportBot.sanitizeMessage({ message }, { allowedTags: ['b', 'i'] });

  return (
    <div
      className={`customer-support-bot-message ${className}`}
      data-testid={dataTestid}
      role={role}
      title={title}
      {...ariaProps}
      {...rest}
    >
      {sanitizedMessage}
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  className: '',
  key: Math.random().toString(),
  dataTestid: 'customer-support-bot',
};

CustomerSupportBot.sanitizeMessage = (options: { message: string }, sanitizeOptions: any) => sanitize(options.message, sanitizeOptions);

export default CustomerSupportBot;

This updated version provides better accessibility, edge cases handling, and maintainability. The `sanitizeMessage` function now accepts an options object, which can be used to specify allowed tags for edge cases. The `data-testid` prop has a default value, making it easier to test the component.