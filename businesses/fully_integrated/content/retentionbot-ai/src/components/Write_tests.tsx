import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface RetentionMessageProps {
  /**
   * The message key to be translated and displayed to the customer.
   */
  messageKey: string;

  /**
   * Additional classes to apply to the component.
   */
  className?: string;

  /**
   * A fallback message to display if the translation fails.
   */
  fallbackMessage?: string;
}

const RetentionMessageComponent: FC<RetentionMessageProps> = ({ messageKey, className, fallbackMessage }) => {
  const { t, i18n } = useTranslation();

  // Check if the message key is provided
  if (!messageKey) {
    return <div>Missing message key</div>;
  }

  // Check if the translation exists, and provide a fallback message if not
  const translatedMessage = t(messageKey, { returnObjects: true })[0] || fallbackMessage;

  // Render the message with the provided key, classes, and fallback message if necessary
  return <div className={className}>{translatedMessage}</div>;
};

RetentionMessageComponent.defaultProps = {
  fallbackMessage: 'An error occurred while loading the message.',
};

RetentionMessageComponent.propTypes = {
  messageKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackMessage: PropTypes.string,
};

export default RetentionMessageComponent;

import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface RetentionMessageProps {
  /**
   * The message key to be translated and displayed to the customer.
   */
  messageKey: string;

  /**
   * Additional classes to apply to the component.
   */
  className?: string;

  /**
   * A fallback message to display if the translation fails.
   */
  fallbackMessage?: string;
}

const RetentionMessageComponent: FC<RetentionMessageProps> = ({ messageKey, className, fallbackMessage }) => {
  const { t, i18n } = useTranslation();

  // Check if the message key is provided
  if (!messageKey) {
    return <div>Missing message key</div>;
  }

  // Check if the translation exists, and provide a fallback message if not
  const translatedMessage = t(messageKey, { returnObjects: true })[0] || fallbackMessage;

  // Render the message with the provided key, classes, and fallback message if necessary
  return <div className={className}>{translatedMessage}</div>;
};

RetentionMessageComponent.defaultProps = {
  fallbackMessage: 'An error occurred while loading the message.',
};

RetentionMessageComponent.propTypes = {
  messageKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackMessage: PropTypes.string,
};

export default RetentionMessageComponent;