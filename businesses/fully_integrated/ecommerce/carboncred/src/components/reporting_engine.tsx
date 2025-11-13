import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Constants
const minimumMessageLength = 1;

// Function to validate props
const validateProps = (props: Props) => {
  const { message } = props;
  if (typeof message !== 'string' || message.length < minimumMessageLength) {
    throw new Error('Invalid "message" prop');
  }
};

interface Props {
  message: string;
  title?: string;
  role?: string;
  className?: string;
}

const ReportingEngine: FC<Props> = ({ message, title, role, className }) => {
  // Implement reporting functionality for CarbonCred platform
  // Track carbon footprint, sell carbon credits, provide sustainability scoring

  const reportClass = classnames('reporting-engine', className);

  validateProps(props);

  return (
    <div className={reportClass} role={role}>
      {title && <h1>{title}</h1>}
      <div data-testid="reporting-engine" aria-label="CarbonCred Reporting Engine">
        {message}
      </div>
    </div>
  );
};

ReportingEngine.defaultProps = {
  title: 'CarbonCred Reporting Engine',
  role: 'presentation',
};

ReportingEngine.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  role: PropTypes.string,
  className: PropTypes.string,
};

ReportingEngine.displayName = 'ReportingEngine';

// Export the component
export default ReportingEngine;

This updated version of the `ReportingEngine` component is more robust, accessible, and easier to maintain. It also provides better testing capabilities and improved debugging.