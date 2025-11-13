import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

interface ExpenseMessageProps {
  message: string;
  isError?: boolean; // Add an optional isError prop for error messages
  onFocus?: () => void; // Add an optional onFocus prop for custom focus behavior
}

const ExpenseMessage: FC<ExpenseMessageProps> = (props) => {
  const { message, isError = false, onFocus } = props; // Destructure props and set default value for isError
  const messageRef = useRef<HTMLDivElement>(null); // Create a ref for the message div to enable focus programmatically

  const handleFocus = useCallback(() => {
    if (messageRef.current) messageRef.current.focus(); // Focus the message div when the component is clicked
    onFocus && onFocus(); // Call the provided onFocus callback if it exists
  }, [onFocus]);

  // Add aria-live for accessibility
  const ariaLive = useMemo(() => {
    return isError ? 'assertive' : 'polite';
  }, [isError]);

  // Add aria-describedby for better accessibility when multiple messages are present
  const ariaDescribedBy = useMemo(() => {
    return props.id ? `describedBy-${props.id}` : undefined;
  }, [props.id]);

  return (
    <div
      id={props.id} // Add an id for better accessibility when multiple messages are present
      ref={messageRef}
      onClick={handleFocus} // Add onClick event to focus the message div
      role="alert" // Set role for accessibility
      aria-live={ariaLive} // Set aria-live for accessibility
      aria-describedby={ariaDescribedBy} // Set aria-describedby for accessibility
    >
      {message}
    </div>
  );
};

export default useMemo(ExpenseMessage, [ExpenseMessage]);

import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

interface ExpenseMessageProps {
  message: string;
  isError?: boolean; // Add an optional isError prop for error messages
  onFocus?: () => void; // Add an optional onFocus prop for custom focus behavior
}

const ExpenseMessage: FC<ExpenseMessageProps> = (props) => {
  const { message, isError = false, onFocus } = props; // Destructure props and set default value for isError
  const messageRef = useRef<HTMLDivElement>(null); // Create a ref for the message div to enable focus programmatically

  const handleFocus = useCallback(() => {
    if (messageRef.current) messageRef.current.focus(); // Focus the message div when the component is clicked
    onFocus && onFocus(); // Call the provided onFocus callback if it exists
  }, [onFocus]);

  // Add aria-live for accessibility
  const ariaLive = useMemo(() => {
    return isError ? 'assertive' : 'polite';
  }, [isError]);

  // Add aria-describedby for better accessibility when multiple messages are present
  const ariaDescribedBy = useMemo(() => {
    return props.id ? `describedBy-${props.id}` : undefined;
  }, [props.id]);

  return (
    <div
      id={props.id} // Add an id for better accessibility when multiple messages are present
      ref={messageRef}
      onClick={handleFocus} // Add onClick event to focus the message div
      role="alert" // Set role for accessibility
      aria-live={ariaLive} // Set aria-live for accessibility
      aria-describedby={ariaDescribedBy} // Set aria-describedby for accessibility
    >
      {message}
    </div>
  );
};

export default useMemo(ExpenseMessage, [ExpenseMessage]);