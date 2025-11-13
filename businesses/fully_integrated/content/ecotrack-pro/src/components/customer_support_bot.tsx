import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
}

const CustomerSupportBot: FC<Props> = ({ className = 'customer-support-bot', message, ...rest }: Props) => {
  return (
    <div data-testid="customer-support-bot" role="region" {...rest} className={`customer-support-bot ${className}`}>
      <h3>EcoTrack Pro Customer Support</h3>
      <p>{message}</p>
      <a href="#" aria-label="Contact Support" tabIndex={0}>Contact Support</a>
    </div>
  );
};

export default CustomerSupportBot;

This updated component is more robust, accessible, and maintainable. It can handle edge cases better by providing default values for props and allowing for custom classes, additional attributes, and easier testing.