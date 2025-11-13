import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string;
  onErrorClear?: () => void;
}

const ErrorComponent: FC<Props> = ({ errorMessage, onErrorClear }) => {
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      const hideError = setTimeout(() => {
        setShowError(false);
        if (onErrorClear) onErrorClear();
      }, 5000);

      return () => clearTimeout(hideError);
    }
  }, [errorMessage, onErrorClear]);

  const accessibleClearButton = (
    <button
      type="button"
      className="error-message-clear-button"
      onClick={onErrorClear}
      aria-label="Clear error message"
    >
      X
    </button>
  );

  return (
    <div className={`error-message ${showError ? '' : 'hidden'}`} role="alert">
      {errorMessage}
      {onErrorClear && accessibleClearButton}
    </div>
  );
};

ErrorComponent.defaultProps = {
  onErrorClear: undefined,
};

export default ErrorComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string;
  onErrorClear?: () => void;
}

const ErrorComponent: FC<Props> = ({ errorMessage, onErrorClear }) => {
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      const hideError = setTimeout(() => {
        setShowError(false);
        if (onErrorClear) onErrorClear();
      }, 5000);

      return () => clearTimeout(hideError);
    }
  }, [errorMessage, onErrorClear]);

  const accessibleClearButton = (
    <button
      type="button"
      className="error-message-clear-button"
      onClick={onErrorClear}
      aria-label="Clear error message"
    >
      X
    </button>
  );

  return (
    <div className={`error-message ${showError ? '' : 'hidden'}`} role="alert">
      {errorMessage}
      {onErrorClear && accessibleClearButton}
    </div>
  );
};

ErrorComponent.defaultProps = {
  onErrorClear: undefined,
};

export default ErrorComponent;