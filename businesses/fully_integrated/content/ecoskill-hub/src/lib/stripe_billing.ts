import React, { forwardRef, HTMLAttributes, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  /**
   * Unique identifier for the component for better accessibility and testing.
   */
  id?: string;
  /**
   * Additional classes to apply to the component for styling.
   */
  className?: string;
}

// Add a unique component name for better identification and maintenance
const EcoSkillHubBillingMessage = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { message, id, className, ...rest } = props;

  // Check if id is provided and it's not empty
  const uniqueId = id && id.trim() !== '';

  return (
    <div
      ref={ref}
      id={uniqueId ? id : undefined} // Only set id if it's provided and not empty
      className={`eco-skill-hub-billing-message ${className || ''}`}
      {...rest}
    >
      {message}
    </div>
  );
});

// Export the component with a descriptive name that reflects its purpose
export { EcoSkillHubBillingMessage };

1. I've used the `DetailedHTMLProps` utility type to extend the `Props` interface, which provides a more complete set of HTML attributes.
2. I've added a check to ensure that the `id` is provided and is not an empty string before setting it as the `id` attribute. This helps prevent potential issues caused by invalid `id` values.
3. I've added a check for the `className` to ensure it's not `null` or `undefined` before concatenating it with the default class name. This helps prevent potential issues caused by unexpected `className` values.