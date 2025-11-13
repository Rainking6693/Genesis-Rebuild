import React, { FunctionComponent, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React from 'react'; // Importing React again to avoid potential issues

interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  ariaLabel?: string; // Adding aria-label for accessibility
}

const EcoSkillHubComponent: FunctionComponent<Props> = ({ message, className, ariaLabel }) => {
  const combinedClassName = classnames('eco-skill-hub-message', className);

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

EcoSkillHubComponent.defaultProps = {
  message: 'Welcome to EcoSkill Hub!',
  ariaLabel: 'EcoSkill Hub welcome message', // Adding default aria-label
};

EcoSkillHubComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string, // Adding propType for aria-label
};

export default EcoSkillHubComponent;

import React, { FunctionComponent, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import React from 'react'; // Importing React again to avoid potential issues

interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  ariaLabel?: string; // Adding aria-label for accessibility
}

const EcoSkillHubComponent: FunctionComponent<Props> = ({ message, className, ariaLabel }) => {
  const combinedClassName = classnames('eco-skill-hub-message', className);

  return (
    <div className={combinedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

EcoSkillHubComponent.defaultProps = {
  message: 'Welcome to EcoSkill Hub!',
  ariaLabel: 'EcoSkill Hub welcome message', // Adding default aria-label
};

EcoSkillHubComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string, // Adding propType for aria-label
};

export default EcoSkillHubComponent;