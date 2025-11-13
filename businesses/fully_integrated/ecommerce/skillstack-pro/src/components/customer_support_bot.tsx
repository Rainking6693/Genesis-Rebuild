import React, { FC, useMemo, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { I18nKey, Theme } from '../../types';
import logger from '../../utils/logger';

interface Props {
  messageId?: I18nKey;
  theme?: Theme;
}

const CustomerSupportBot: FC<Props> = ({ messageId, theme }) => {
  const { t } = useTranslation();

  const getMessage = useCallback(() => {
    if (!messageId) {
      return t('welcomeMessage');
    }
    try {
      return t(messageId);
    } catch (error) {
      logger.error(`Error translating message: ${messageId}`, error);
      return `Error translating message: ${messageId}`;
    }
  }, [messageId, t]);

  const message = useMemo(() => getMessage(), [getMessage]);

  return (
    <div
      className={`customer-support-bot-message ${theme === 'dark' ? 'dark' : ''}`}
      role="alert"
    >
      {message}
    </div>
  );
};

CustomerSupportBot.defaultProps = {
  messageId: 'welcomeMessage',
  theme: 'light',
};

CustomerSupportBot.propTypes = {
  messageId: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

CustomerSupportBot.logEvent = (message: string) => {
  logger.info(`Customer Support Bot: ${message}`);
};

// Memoize the component
const MemoizedCustomerSupportBot = React.memo(CustomerSupportBot);
export default MemoizedCustomerSupportBot;

In this version, I've added the following improvements:

1. I've added a `theme` prop to dynamically apply the appropriate CSS class based on the current theme (light or dark).

2. I've added a `getMessage` function to handle the translation and potential errors gracefully. If an error occurs during translation, it logs the error and returns a fallback message.

3. I've used the `useCallback` hook to ensure that the `getMessage` function doesn't create unnecessary re-renders.

4. I've updated the propTypes to reflect the changes in the props structure and added the `oneOf` validator for the `theme` prop.

5. I've moved the logger import to the top level to make it more accessible.

6. I've used the `useMemo` hook to optimize performance by memoizing the `message` based on the `getMessage` function. This ensures that the message is only recomputed when the `getMessage` function changes.