import React, { FC, ReactNode, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }: PropsWithChildren<Props>) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';
  const fallback: ReactNode = <div>No message provided</div>;

  return (
    <div>
      {sanitizedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        fallback
      )}
      {message && !sanitizedMessage && <div>Invalid message provided. Please review.</div>}
      {!message && <div>Message is missing.</div>}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }: PropsWithChildren<Props>) => {
  const sanitizedMessage = message ? DOMPurify.sanitize(message) : '';
  const fallback: ReactNode = <div>No message provided</div>;

  return (
    <div>
      {sanitizedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        fallback
      )}
      {message && !sanitizedMessage && <div>Invalid message provided. Please review.</div>}
      {!message && <div>Message is missing.</div>}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;