import React, { FC, useMemo, useEffect, useState } from 'react';
import emailObfuscate from 'email-obfuscate';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  email?: string;
}

const obfuscateEmail = (message: string) => emailObfuscate(message);

const MyComponent: FC<Props> = ({ message, email }) => {
  const [obfuscatedMessage, setObfuscatedMessage] = useState('');

  useEffect(() => {
    if (email) {
      setObfuscatedMessage(obfuscateEmail(message));
    }
  }, [message, email]);

  return (
    <div>
      {email && (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: obfuscatedMessage }}
            aria-label={message} // Adding aria-label for accessibility
          />
          <a href={`mailto:${email}`}>{email}</a>
        </>
      )}
      {!email && (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  email: undefined,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  email: PropTypes.string,
};

export { obfuscateEmail, MyComponent };

import React, { FC, useMemo, useEffect, useState } from 'react';
import emailObfuscate from 'email-obfuscate';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  email?: string;
}

const obfuscateEmail = (message: string) => emailObfuscate(message);

const MyComponent: FC<Props> = ({ message, email }) => {
  const [obfuscatedMessage, setObfuscatedMessage] = useState('');

  useEffect(() => {
    if (email) {
      setObfuscatedMessage(obfuscateEmail(message));
    }
  }, [message, email]);

  return (
    <div>
      {email && (
        <>
          <div
            dangerouslySetInnerHTML={{ __html: obfuscatedMessage }}
            aria-label={message} // Adding aria-label for accessibility
          />
          <a href={`mailto:${email}`}>{email}</a>
        </>
      )}
      {!email && (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  email: undefined,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  email: PropTypes.string,
};

export { obfuscateEmail, MyComponent };