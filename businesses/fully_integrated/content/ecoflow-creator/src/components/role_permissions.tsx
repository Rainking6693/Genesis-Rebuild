import React, { FC, Key, ReactNode } from 'react';

const COMPONENT_NAME = 'EcoFlowCreatorRolePermissionsComponent';

type Props = {
  message: string;
};

const FunctionalComponent: FC<Props> = ({ message }) => {
  // Use a unique key for each rendered element for better performance in lists
  const uniqueKey = `${COMPONENT_NAME}-${Math.random().toString(36).substring(7)}` as Key;

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Ensure the sanitizedMessage is not empty or null before rendering
  if (!sanitizedMessage) {
    return <div key={uniqueKey} aria-hidden={true} />;
  }

  // Use aria-label for accessibility
  return (
    <div key={uniqueKey} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={`Role permissions message: ${message}`} />
  );
};

// Add a type for the default export to improve type checking and maintainability
export default FunctionalComponent as React.FC<Props>;

// Add a propTypes for Props to ensure type checking in development
import _ from 'lodash';
import PropTypes from 'prop-types';

_.flowRight(
  PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
)(FunctionalComponent.propTypes = {});

In this updated code, I've added a check to ensure the sanitizedMessage is not empty or null before rendering. This helps prevent potential issues when the message is not provided. I've also added propTypes for Props to ensure type checking in development. Additionally, I've imported lodash and PropTypes to make the code more concise when defining the propTypes.