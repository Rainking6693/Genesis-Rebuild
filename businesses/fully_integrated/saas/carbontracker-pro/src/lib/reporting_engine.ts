import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  error?: Error;
  isError?: boolean;
}

const ReportingEngine: FC<Props> = ({ message, error, isError = false }) => {
  if (error) {
    // Handle errors by displaying a more informative message
    message = `An error occurred: ${error.message}`;
    isError = true;
  }

  // Implement reporting functionality here
  // Add a unique key for each report to ensure React identifies changes
  const key = message || 'no-report';

  return (
    <div data-testid="reporting-engine" role="alert" aria-live="polite">
      {isError && <strong>Error:</strong>}
      <span>{message}</span>
    </div>
  );
};

ReportingEngine.defaultProps = {
  message: 'No report to display',
};

ReportingEngine.propTypes = {
  message: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error),
};

export { ReportingEngine };

In this updated version, I added an `isError` prop to better handle the display of error messages. I also added a `data-testid` attribute for easier testing and a `role` and `aria-live` attribute for better accessibility. Lastly, I added a default value for the `isError` prop to avoid passing `undefined` to the component.