import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define a common interface for all components that use dangerouslySetInnerHTML
interface DangerouslySetInnerHTMLProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dangerouslySetInnerHTML: { __html: string };
}

// Create a reusable and accessible DangerouslySetInnerHTML component
const DangerouslySetInnerHTMLComponent: FC<DangerouslySetInnerHTMLProps> = ({ children, ...props }) => {
  // Check if children is an object with a '__html' property
  if (typeof children !== 'object' || !('__html' in children)) {
    return <div />; // Return an empty div if children is not valid
  }

  return <div {...props} dangerouslySetInnerHTML={children} />;
};

// Use the reusable DangerouslySetInnerHTMLComponent for better maintainability
const MyComponent: FC<{ message: string }> = ({ message }) => {
  // Check if message is a string
  if (typeof message !== 'string') {
    throw new Error('message prop must be a string'); // Throw an error if message is not a string
  }

  return <DangerouslySetInnerHTMLComponent dangerouslySetInnerHTML={{ __html: message }} />;
};

// Importing React and FC only once for better performance and maintainability
import React, { FC } from 'react';

// Using aria-label for accessibility
const ReviewFlowAI = () => {
  return (
    <div>
      {/* Render multiple instances of MyComponent with dynamic messages */}
      <MyComponent aria-label="Thank you for your feedback" message="Thank you for your feedback! We appreciate your business." />
      <MyComponent aria-label="Contact us for a better experience" message="We're sorry to hear about your experience. Please contact us so we can make it right." />
    </div>
  );
};

export default ReviewFlowAI;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define a common interface for all components that use dangerouslySetInnerHTML
interface DangerouslySetInnerHTMLProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dangerouslySetInnerHTML: { __html: string };
}

// Create a reusable and accessible DangerouslySetInnerHTML component
const DangerouslySetInnerHTMLComponent: FC<DangerouslySetInnerHTMLProps> = ({ children, ...props }) => {
  // Check if children is an object with a '__html' property
  if (typeof children !== 'object' || !('__html' in children)) {
    return <div />; // Return an empty div if children is not valid
  }

  return <div {...props} dangerouslySetInnerHTML={children} />;
};

// Use the reusable DangerouslySetInnerHTMLComponent for better maintainability
const MyComponent: FC<{ message: string }> = ({ message }) => {
  // Check if message is a string
  if (typeof message !== 'string') {
    throw new Error('message prop must be a string'); // Throw an error if message is not a string
  }

  return <DangerouslySetInnerHTMLComponent dangerouslySetInnerHTML={{ __html: message }} />;
};

// Importing React and FC only once for better performance and maintainability
import React, { FC } from 'react';

// Using aria-label for accessibility
const ReviewFlowAI = () => {
  return (
    <div>
      {/* Render multiple instances of MyComponent with dynamic messages */}
      <MyComponent aria-label="Thank you for your feedback" message="Thank you for your feedback! We appreciate your business." />
      <MyComponent aria-label="Contact us for a better experience" message="We're sorry to hear about your experience. Please contact us so we can make it right." />
    </div>
  );
};

export default ReviewFlowAI;