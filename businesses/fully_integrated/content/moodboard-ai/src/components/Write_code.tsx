import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isLoading?: boolean; // Flag for loading state
  hasError?: boolean; // Flag for error state
}

const MyComponent: FC<Props> = ({
  className,
  message,
  children,
  isLoading = false,
  hasError = false,
  ...rest
}) => {
  const moodboardMessageClasses = 'moodboard-message';
  const componentClasses = `${moodboardMessageClasses} ${className || ''}`;

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (hasError) {
    content = <div>Error occurred.</div>;
  } else {
    content = <>{message || children}</>;
  }

  return (
    <div {...rest} className={componentClasses}>
      {content}
    </div>
  );
};

MyComponent.defaultProps = {
  isLoading: false,
  hasError: false,
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isLoading?: boolean; // Flag for loading state
  hasError?: boolean; // Flag for error state
}

const MyComponent: FC<Props> = ({
  className,
  message,
  children,
  isLoading = false,
  hasError = false,
  ...rest
}) => {
  const moodboardMessageClasses = 'moodboard-message';
  const componentClasses = `${moodboardMessageClasses} ${className || ''}`;

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (hasError) {
    content = <div>Error occurred.</div>;
  } else {
    content = <>{message || children}</>;
  }

  return (
    <div {...rest} className={componentClasses}>
      {content}
    </div>
  );
};

MyComponent.defaultProps = {
  isLoading: false,
  hasError: false,
};

export default MyComponent;