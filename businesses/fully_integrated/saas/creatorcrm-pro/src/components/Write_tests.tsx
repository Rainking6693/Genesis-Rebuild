import React, { PropsWithChildren, ReactNode } from 'react';
import { Component as FunctionalComponent } from 'react';

interface Props extends PropsWithChildren {
  /**
   * The main message to be displayed.
   */
  message: ReactNode;

  /**
   * Additional classes to be applied to the component.
   */
  className?: string;

  /**
   * A unique ID for the component for accessibility purposes.
   */
  id?: string;

  /**
   * Optional error message to be displayed when the component encounters an error.
   */
  errorMessage?: string;
}

// Add a meaningful component name
const CreatorCRMPartnershipMessage: FunctionalComponent<Props> = ({
  message,
  className,
  id,
  children,
  errorMessage,
}) => {
  // Add a unique key for the div element to ensure it's unique in the DOM
  const uniqueKey = id || `${Math.random()}`;

  // Handle edge cases where message is not provided
  if (!message) {
    return null;
  }

  // Handle edge cases where errorMessage is provided and message is not
  if (errorMessage && !message) {
    return (
      <div id={uniqueKey} className={className} role="alert" aria-live="polite">
        {errorMessage}
      </div>
    );
  }

  // Add a role="alert" for accessibility purposes
  return (
    <div id={uniqueKey} className={className} role="alert" aria-live="polite">
      {message}
      {children}
    </div>
  );
};

// Add a defaultProps object for better maintainability
CreatorCRMPartnershipMessage.defaultProps = {
  errorMessage: '',
};

export default CreatorCRMPartnershipMessage;

import React, { PropsWithChildren, ReactNode } from 'react';
import { Component as FunctionalComponent } from 'react';

interface Props extends PropsWithChildren {
  /**
   * The main message to be displayed.
   */
  message: ReactNode;

  /**
   * Additional classes to be applied to the component.
   */
  className?: string;

  /**
   * A unique ID for the component for accessibility purposes.
   */
  id?: string;

  /**
   * Optional error message to be displayed when the component encounters an error.
   */
  errorMessage?: string;
}

// Add a meaningful component name
const CreatorCRMPartnershipMessage: FunctionalComponent<Props> = ({
  message,
  className,
  id,
  children,
  errorMessage,
}) => {
  // Add a unique key for the div element to ensure it's unique in the DOM
  const uniqueKey = id || `${Math.random()}`;

  // Handle edge cases where message is not provided
  if (!message) {
    return null;
  }

  // Handle edge cases where errorMessage is provided and message is not
  if (errorMessage && !message) {
    return (
      <div id={uniqueKey} className={className} role="alert" aria-live="polite">
        {errorMessage}
      </div>
    );
  }

  // Add a role="alert" for accessibility purposes
  return (
    <div id={uniqueKey} className={className} role="alert" aria-live="polite">
      {message}
      {children}
    </div>
  );
};

// Add a defaultProps object for better maintainability
CreatorCRMPartnershipMessage.defaultProps = {
  errorMessage: '',
};

export default CreatorCRMPartnershipMessage;