import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string;
  className?: string;
}

const MyComponent: React.FC<Props & PropsWithChildren> = ({ id, className, children }) => {
  const { t } = useTranslation();

  // Check if message is provided, otherwise use default message from i18n
  const message = children || t('default_message');

  return (
    <div id={id} className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  id: undefined,
  className: '',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string;
  className?: string;
}

const MyComponent: React.FC<Props & PropsWithChildren> = ({ id, className, children }) => {
  const { t } = useTranslation();

  // Check if message is provided, otherwise use default message from i18n
  const message = children || t('default_message');

  return (
    <div id={id} className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  id: undefined,
  className: '',
};

export default MyComponent;