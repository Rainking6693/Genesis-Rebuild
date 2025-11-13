import React, { FC, useEffect, useState } from 'react';
import classnames from 'classnames';

interface Props {
  message: string;
  error?: boolean;
  loading?: boolean;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, error = false, loading = false, className }) => {
  const [visible, setVisible] = useState(loading || !error);

  useEffect(() => {
    setVisible(loading || !error);
  }, [loading, error]);

  return (
    <div className={classnames('user-auth-message', className, { 'user-auth-message--error': error, 'user-auth-message--loading': loading })}>
      {visible && <div>{message}</div>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import classnames from 'classnames';

interface Props {
  message: string;
  error?: boolean;
  loading?: boolean;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, error = false, loading = false, className }) => {
  const [visible, setVisible] = useState(loading || !error);

  useEffect(() => {
    setVisible(loading || !error);
  }, [loading, error]);

  return (
    <div className={classnames('user-auth-message', className, { 'user-auth-message--error': error, 'user-auth-message--loading': loading })}>
      {visible && <div>{message}</div>}
    </div>
  );
};

export default MyComponent;