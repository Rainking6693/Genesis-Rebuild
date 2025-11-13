import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  error?: string;
  success?: string;
}

const Message: FC<{ message: string; type?: 'error' | 'success' }> = ({ message, type }) => {
  const { t } = useTranslation();

  return (
    <div className={classnames('user-auth-message', { 'user-auth-message--error': type === 'error', 'user-auth-message--success': type === 'success' })}>
      {message || t(`components.userAuth.${type}`)}
    </div>
  );
};

const MyComponent: FC<Props> = ({ className, error, success }) => {
  const message = error ? <Message message={error} type="error" /> : success ? <Message message={success} type="success" /> : null;

  return <div className={className}>{message}</div>;
};

MyComponent.defaultProps = {
  className: '',
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  error?: string;
  success?: string;
}

const Message: FC<{ message: string; type?: 'error' | 'success' }> = ({ message, type }) => {
  const { t } = useTranslation();

  return (
    <div className={classnames('user-auth-message', { 'user-auth-message--error': type === 'error', 'user-auth-message--success': type === 'success' })}>
      {message || t(`components.userAuth.${type}`)}
    </div>
  );
};

const MyComponent: FC<Props> = ({ className, error, success }) => {
  const message = error ? <Message message={error} type="error" /> : success ? <Message message={success} type="success" /> : null;

  return <div className={className}>{message}</div>;
};

MyComponent.defaultProps = {
  className: '',
};

export default MyComponent;