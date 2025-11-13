import React, { Key, useId } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string;
  message?: string;
}

type TFunction = (key: string, options?: { returnObjects: boolean }) => string | string[];

const MyComponent: React.FC<Props> = ({ id, message }) => {
  const { t } = useTranslation();
  const componentId = useId();

  const getTranslatedMessage = (key: string) => {
    const messages = t(key, { returnObjects: true });
    const pluralForm = messages.length > 1 ? messages.findIndex((_, i) => i === messages.length - 1) !== -1 : false;
    return pluralForm ? messages : messages[0];
  };

  const fallbackMessage = 'Dashboard UI - My Component';
  const translatedMessage = message ? message : getTranslatedMessage('dashboard.ui.myComponentMessage')[0] || fallbackMessage;

  // Use htmlFor for better accessibility
  const htmlFor = `myComponent-${componentId}`;

  return (
    <div id={id || componentId} htmlFor={htmlFor}>
      {translatedMessage}
    </div>
  );
};

export default React.memo(MyComponent);