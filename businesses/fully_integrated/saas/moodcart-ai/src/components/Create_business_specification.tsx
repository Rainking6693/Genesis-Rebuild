import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import { isEmpty } from 'lodash';

// Define allowed attributes for accessibility purposes
const allowedAttributes = {
  '*': {
    class: [],
    style: [],
  },
};

interface Props {
  message: string;
}

const MyComponentDisplay: FC<Props> = ({ message }) => {
  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(message, {
          allowedTags: [],
          allowedAttributes,
        }),
      }}
      aria-hidden={isEmpty(message) || message === '<br>'} // Hide the element if the message is empty or only contains a line break
      aria-label={message} // Provide an aria-label for better accessibility
    />
  );
};

const MyComponentSanitizer = (message: string) => {
  return sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes,
  });
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(MyComponentSanitizer(message));
  const handleMessageChange = (newMessage: string) => {
    setSanitizedMessage(MyComponentSanitizer(newMessage));
  };

  useMemo(() => {
    setSanitizedMessage(MyComponentSanitizer(message));
  }, [message]);

  return <MyComponentDisplay message={sanitizedMessage} onChange={handleMessageChange} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import { isEmpty } from 'lodash';

// Define allowed attributes for accessibility purposes
const allowedAttributes = {
  '*': {
    class: [],
    style: [],
  },
};

interface Props {
  message: string;
}

const MyComponentDisplay: FC<Props> = ({ message }) => {
  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(message, {
          allowedTags: [],
          allowedAttributes,
        }),
      }}
      aria-hidden={isEmpty(message) || message === '<br>'} // Hide the element if the message is empty or only contains a line break
      aria-label={message} // Provide an aria-label for better accessibility
    />
  );
};

const MyComponentSanitizer = (message: string) => {
  return sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes,
  });
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(MyComponentSanitizer(message));
  const handleMessageChange = (newMessage: string) => {
    setSanitizedMessage(MyComponentSanitizer(newMessage));
  };

  useMemo(() => {
    setSanitizedMessage(MyComponentSanitizer(message));
  }, [message]);

  return <MyComponentDisplay message={sanitizedMessage} onChange={handleMessageChange} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;