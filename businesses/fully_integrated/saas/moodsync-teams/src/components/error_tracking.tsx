import React, { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import { ErrorMessage, HelpBlock, FormFeedback } from 'react-bootstrap';

interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string | null;
  error?: Error | null;
  isValid?: boolean;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, error, isValid, className, ...rest }, ref) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleFocus = () => {
    setShowHelp(true);
  };

  const handleBlur = () => {
    setShowHelp(false);
  };

  const errorMessage = error ? error.message : message;
  const feedbackMessage = errorMessage || (isValid && !message ? 'Everything looks good!' : 'Please provide a valid input.');

  return (
    <div ref={ref} {...rest} className={className} onFocus={handleFocus} onBlur={handleBlur}>
      {errorMessage && (
        <>
          <FormFeedback type="invalid">
            <ErrorMessage className="text-danger">{errorMessage}</ErrorMessage>
          </FormFeedback>
          {showHelp && (
            <HelpBlock className="text-muted">
              For more information, please contact our support team.
            </HelpBlock>
          )}
        </>
      )}
      {children}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { forwardRef, HTMLAttributes, useRef, useState } from 'react';
import { ErrorMessage, HelpBlock, FormFeedback } from 'react-bootstrap';

interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string | null;
  error?: Error | null;
  isValid?: boolean;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, error, isValid, className, ...rest }, ref) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleFocus = () => {
    setShowHelp(true);
  };

  const handleBlur = () => {
    setShowHelp(false);
  };

  const errorMessage = error ? error.message : message;
  const feedbackMessage = errorMessage || (isValid && !message ? 'Everything looks good!' : 'Please provide a valid input.');

  return (
    <div ref={ref} {...rest} className={className} onFocus={handleFocus} onBlur={handleBlur}>
      {errorMessage && (
        <>
          <FormFeedback type="invalid">
            <ErrorMessage className="text-danger">{errorMessage}</ErrorMessage>
          </FormFeedback>
          {showHelp && (
            <HelpBlock className="text-muted">
              For more information, please contact our support team.
            </HelpBlock>
          )}
        </>
      )}
      {children}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;