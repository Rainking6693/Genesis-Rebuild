import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

type AllowedAttributes = {
  href?: string;
  target?: string;
  rel?: string;
};

type AllowedTags = {
  p: {};
  strong: {};
  em: {};
  a: AllowedAttributes;
};

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = useMemo(() => {
    if (!message || !sanitizeHtml(message, { allowedTags: {} as AllowedTags, allowedAttributes: {} as AllowedAttributes })) {
      return '';
    }

    const sanitized = sanitizeHtml(message, {
      allowedTags: [{ p: {}, strong: {}, em: {}, a: { href: {}, target: {}, rel: {} } }],
      allowedAttributes: {
        a: {
          href: {},
          target: {},
          rel: {},
        },
      },
    });

    // Check for invalid HTML in sanitized output
    if (!sanitizeHtml.isTrusted(sanitized)) {
      throw new Error('Invalid HTML in sanitized output');
    }

    return sanitized;
  }, [message]);

  return (
    <div>
      {/* Add aria-label for accessibility */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={message} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;