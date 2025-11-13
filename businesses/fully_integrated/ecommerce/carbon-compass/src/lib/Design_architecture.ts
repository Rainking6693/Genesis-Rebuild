import React, { FC, Key, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string; // Add an optional id for accessibility purposes
  message?: string;
}

const CarbonCompassMessage: FC<Props> = ({ id, message }) => {
  const { t, i18n } = useTranslation();

  // Validate the i18n functions and message
  if (!t || !i18n) {
    console.error('react-i18next not properly initialized');
    return null;
  }

  // Use a translated message if provided, otherwise use the prop message
  const translatedMessage = message || t(id || '', { ns: i18n.language });

  // Validate the translated message is a string
  if (typeof translatedMessage !== 'string') {
    console.error(`Invalid message type for id: ${id}`);
    return null;
  }

  return (
    <div data-testid={id} aria-label={translatedMessage} key={id}>
      {translatedMessage}
    </div>
  );
};

CarbonCompassMessage.defaultProps = {
  id: '',
  message: '',
};

CarbonCompassMessage.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
};

CarbonCompassMessage.displayName = 'CarbonCompassMessage';

// Memoize the component if it doesn't depend on any props that change frequently
const MemoizedCarbonCompassMessage: FC<Props> = React.memo(CarbonCompassMessage);

export { MemoizedCarbonCompassMessage as default };
export { MemoizedCarbonCompassMessage };

import React, { FC, Key, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string; // Add an optional id for accessibility purposes
  message?: string;
}

const CarbonCompassMessage: FC<Props> = ({ id, message }) => {
  const { t, i18n } = useTranslation();

  // Validate the i18n functions and message
  if (!t || !i18n) {
    console.error('react-i18next not properly initialized');
    return null;
  }

  // Use a translated message if provided, otherwise use the prop message
  const translatedMessage = message || t(id || '', { ns: i18n.language });

  // Validate the translated message is a string
  if (typeof translatedMessage !== 'string') {
    console.error(`Invalid message type for id: ${id}`);
    return null;
  }

  return (
    <div data-testid={id} aria-label={translatedMessage} key={id}>
      {translatedMessage}
    </div>
  );
};

CarbonCompassMessage.defaultProps = {
  id: '',
  message: '',
};

CarbonCompassMessage.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
};

CarbonCompassMessage.displayName = 'CarbonCompassMessage';

// Memoize the component if it doesn't depend on any props that change frequently
const MemoizedCarbonCompassMessage: FC<Props> = React.memo(CarbonCompassMessage);

export { MemoizedCarbonCompassMessage as default };
export { MemoizedCarbonCompassMessage };