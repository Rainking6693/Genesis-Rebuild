import React, { FunctionComponent, ReactNode, useState } from 'react';
import PropTypes from 'prop-types';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message: string }> {
  /**
   * Custom id for accessibility purposes
   */
  id?: string;

  /**
   * Additional classes for styling
   */
  className?: string;

  /**
   * Error message to display if the message prop is invalid
   */
  errorMessage?: string;

  /**
   * Indicates if the message is an error or not (for accessibility purposes)
   */
  isError?: boolean;
}

const GreenTrackProMessage: FunctionComponent<Props> = ({
  children: message,
  id,
  className,
  errorMessage,
  isError = false,
}) => {
  const [hasError, setHasError] = useState(!!errorMessage);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(!!event.target.value.trim().length === 0);
  };

  if (!message) {
    return (
      <div>
        {errorMessage || 'Invalid message prop provided'}
      </div>
    );
  }

  return (
    <div id={id} className={`green-track-pro-message ${className} ${hasError ? 'error' : ''}`}>
      <input
        type="hidden"
        value={message}
        aria-hidden={true}
        onChange={handleMessageChange}
      />
      {isError && <span className="visually-hidden">Error:</span>}
      {message}
    </div>
  );
};

GreenTrackProMessage.defaultProps = {
  message: 'Welcome to GreenTrack Pro',
  id: 'green-track-pro-message',
};

GreenTrackProMessage.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  isError: PropTypes.bool,
};

export default GreenTrackProMessage;

Changes made:

1. Added `isError` prop to indicate if the message is an error or not, which helps with accessibility.
2. Added a hidden input field for the message to make it programmatically accessible.
3. Implemented a state variable `hasError` to check if the message prop is invalid.
4. Added a visually hidden error label for screen readers when `isError` is true.
5. Updated the className to include an error class when `hasError` is true.
6. Removed the duplicated component definition.