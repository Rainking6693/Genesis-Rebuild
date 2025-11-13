import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface OffsetMessageProps {
  /**
   * The message key for the i18n translation
   */
  messageKey: string;
}

/**
 * OffsetMessage Component
 * Renders a message about carbon offsets
 */
const OffsetMessage: React.FC<PropsWithChildren<OffsetMessageProps>> = ({ messageKey }) => {
  const { t } = useTranslation();

  return <div>{t(messageKey)}</div>;
};

OffsetMessage.propTypes = {
  messageKey: PropTypes.string.isRequired,
};

export default OffsetMessage;

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface OffsetMessageProps {
  /**
   * The message key for the i18n translation
   */
  messageKey: string;
}

/**
 * OffsetMessage Component
 * Renders a message about carbon offsets
 */
const OffsetMessage: React.FC<PropsWithChildren<OffsetMessageProps>> = ({ messageKey }) => {
  const { t } = useTranslation();

  return <div>{t(messageKey)}</div>;
};

OffsetMessage.propTypes = {
  messageKey: PropTypes.string.isRequired,
};

export default OffsetMessage;