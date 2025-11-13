import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isLoading?: boolean; // Flag for loading state
  hasError?: boolean; // Flag for error state
  errorMessage?: string; // Error message to display when hasError is true
}

const ReviewCraftAIComponent: FC<Props> = ({
  className,
  id,
  ariaLabel,
  message,
  children,
  isLoading = false,
  hasError = false,
  errorMessage,
  ...rest
}) => {
  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (hasError) {
    content = (
      <>
        <div>{errorMessage}</div>
        {/* Provide a link to report the error for better maintainability */}
        <a href="mailto:support@reviewcraft.ai?subject=Usage Analytics Error Report">Report Error</a>
      </>
    );
  } else {
    content = <>{message}</>;
    if (children) content = <>{content}{children}</>;
  }

  return (
    <div id={id} className={`reviewcraft-ai-component ${className}`} aria-label={ariaLabel}>
      {content}
    </div>
  );
};

ReviewCraftAIComponent.displayName = "ReviewCraftAIComponent";

export default ReviewCraftAIComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isLoading?: boolean; // Flag for loading state
  hasError?: boolean; // Flag for error state
  errorMessage?: string; // Error message to display when hasError is true
}

const ReviewCraftAIComponent: FC<Props> = ({
  className,
  id,
  ariaLabel,
  message,
  children,
  isLoading = false,
  hasError = false,
  errorMessage,
  ...rest
}) => {
  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (hasError) {
    content = (
      <>
        <div>{errorMessage}</div>
        {/* Provide a link to report the error for better maintainability */}
        <a href="mailto:support@reviewcraft.ai?subject=Usage Analytics Error Report">Report Error</a>
      </>
    );
  } else {
    content = <>{message}</>;
    if (children) content = <>{content}{children}</>;
  }

  return (
    <div id={id} className={`reviewcraft-ai-component ${className}`} aria-label={ariaLabel}>
      {content}
    </div>
  );
};

ReviewCraftAIComponent.displayName = "ReviewCraftAIComponent";

export default ReviewCraftAIComponent;