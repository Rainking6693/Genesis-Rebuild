import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

// Interface for common props that can contain a type for better type checking
interface CommonProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type?: 'sustainability' | 'general';
  message: string;
}

// Interface for props that can contain a class name for styling and accessibility purposes
interface StyledProps extends CommonProps {
  className?: string;
}

// Base Message component that can be extended for specific use cases
const BaseMessage: React.FC<StyledProps> = ({ type = 'general', className, message, ...props }) => {
  return <div className={`message ${type} ${className}`} {...props}>{message}</div>;
};

// Component for displaying a personalized sustainability impact story or marketing content
const SustainabilityStory = BaseMessage as React.FC<Omit<StyledProps, 'type'>>;

// Component for displaying general messages (e.g., error messages)
const GeneralMessage = BaseMessage as React.FC<Omit<StyledProps, 'type'>>;

// Add a default export for better code organization
export default { SustainabilityStory, GeneralMessage };

// Edge cases handling
// Add a default className for better accessibility and maintainability
const defaultClassName = 'message-container';

// Update the components to use the default className when no className is provided
const SustainabilityStoryWithDefaultClassName: React.FC<Omit<StyledProps, 'type'>> = ({ className, ...props }) => {
  const finalClassName = className || defaultClassName;
  return <SustainabilityStory {...props} className={finalClassName} />;
};

const GeneralMessageWithDefaultClassName: React.FC<Omit<StyledProps, 'type'>> = ({ className, ...props }) => {
  const finalClassName = className || defaultClassName;
  return <GeneralMessage {...props} className={finalClassName} />;
};

// Update the default export to include the components with default className
export default {
  SustainabilityStory: SustainabilityStoryWithDefaultClassName,
  GeneralMessage: GeneralMessageWithDefaultClassName,
};

In this updated code, I've created a base `BaseMessage` component that can be extended for specific use cases like `SustainabilityStory` and `GeneralMessage`. This makes the code more maintainable and easier to extend in the future.

I've also added a default className for better accessibility and maintainability. The components now use the default className when no className is provided, which helps ensure consistent styling across the application.

Lastly, I've updated the default export to include the components with the default className for better code organization.