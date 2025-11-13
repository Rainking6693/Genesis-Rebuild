import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  businessName: string; // Use a more descriptive name for the prop to align with the business context
  businessUrl?: string; // Add optional prop for business URL to improve accessibility
  businessLogoUrl?: string; // Add optional prop for business logo URL to improve branding and accessibility
}

const ReviewFlowAIComponent: FC<Props> = ({ businessName, businessUrl, businessLogoUrl }) => {
  const memoizedComponent = useMemo(() => (
    <>
      {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} />}
      <h1>Welcome to {businessName}!</h1>
      {businessUrl && (
        <a href={businessUrl} target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      )}
    </>
  ), [businessName, businessUrl, businessLogoUrl]);

  return memoizedComponent;
};

ReviewFlowAIComponent.defaultProps = {
  businessName: 'ReviewFlow AI',
  businessUrl: undefined, // Set default value to undefined for the optional prop
  businessLogoUrl: undefined // Set default value to undefined for the optional prop
};

ReviewFlowAIComponent.propTypes = {
  businessName: PropTypes.string.isRequired,
  businessUrl: PropTypes.string,
  businessLogoUrl: PropTypes.string
};

export default ReviewFlowAIComponent;

import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  businessName: string; // Use a more descriptive name for the prop to align with the business context
  businessUrl?: string; // Add optional prop for business URL to improve accessibility
  businessLogoUrl?: string; // Add optional prop for business logo URL to improve branding and accessibility
}

const ReviewFlowAIComponent: FC<Props> = ({ businessName, businessUrl, businessLogoUrl }) => {
  const memoizedComponent = useMemo(() => (
    <>
      {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} />}
      <h1>Welcome to {businessName}!</h1>
      {businessUrl && (
        <a href={businessUrl} target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      )}
    </>
  ), [businessName, businessUrl, businessLogoUrl]);

  return memoizedComponent;
};

ReviewFlowAIComponent.defaultProps = {
  businessName: 'ReviewFlow AI',
  businessUrl: undefined, // Set default value to undefined for the optional prop
  businessLogoUrl: undefined // Set default value to undefined for the optional prop
};

ReviewFlowAIComponent.propTypes = {
  businessName: PropTypes.string.isRequired,
  businessUrl: PropTypes.string,
  businessLogoUrl: PropTypes.string
};

export default ReviewFlowAIComponent;