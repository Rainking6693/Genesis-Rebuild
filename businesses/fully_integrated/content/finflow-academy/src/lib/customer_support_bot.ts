import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message: string;
  className?: string;
};

const CustomerSupportBot: FC<Props> = ({ className = 'customer-support-bot__default', message, ...rest }: Props) => {
  // Use a unique key for each rendered element for performance optimization
  const key: Key = `${message}-${Math.random().toString()}`;

  // Check if the provided className is valid
  const validClassName = /^[a-zA-Z0-9-_]+$/.test(className);
  if (!validClassName) {
    throw new Error('Invalid className provided. Please use only alphanumeric characters, hyphens, and underscores.');
  }

  return <div className={`customer-support-bot ${className}`} key={key} {...rest}>{message}</div>;
};

// Use a named export for better maintainability and easier testing
export { CustomerSupportBot };

In this updated version, I've made the following changes:

1. Added a default value for the `className` property to ensure it's always provided.
2. Checked if the provided `className` is valid to prevent potential errors.
3. Used the `Key` type from React for the unique key property.

These changes should help improve the resiliency, type safety, and maintainability of the `CustomerSupportBot` component. Additionally, it makes the component easier to test by ensuring that the required properties are always provided and valid.