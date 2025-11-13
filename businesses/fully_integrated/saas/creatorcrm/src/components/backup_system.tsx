import React, { FC, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

interface Props {
  message: string;
}

const sanitizeHtml = (unsafeString: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = unsafeString;
  return tempElement.textContent || '';
};

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    if (!isEmpty(message)) {
      setSafeMessage(sanitizeHtml(message));
    }
  }, [message]);

  return (
    <div className="backup-system-status">
      <h1 className="sr-only">Backup System Status</h1>
      <h2>Backup System Status</h2>
      <p id="status-message" role="alert">
        {safeMessage}
      </p>
      <p id="status-message-aria-label">Backup system status message</p>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

interface Props {
  message: string;
}

const sanitizeHtml = (unsafeString: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = unsafeString;
  return tempElement.textContent || '';
};

const MyComponent: FC<Props> = ({ message }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    if (!isEmpty(message)) {
      setSafeMessage(sanitizeHtml(message));
    }
  }, [message]);

  return (
    <div className="backup-system-status">
      <h1 className="sr-only">Backup System Status</h1>
      <h2>Backup System Status</h2>
      <p id="status-message" role="alert">
        {safeMessage}
      </p>
      <p id="status-message-aria-label">Backup system status message</p>
    </div>
  );
};

export default MyComponent;