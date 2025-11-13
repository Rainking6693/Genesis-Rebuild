import React, { FC, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cleanHTML } from 'html-react-parser';

interface Props {
  message?: string;
}

const defaultAllowedAttributes = {
  ...PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  'data-testid': PropTypes.string,
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = useMemo(() => {
    if (!message) return '';
    return cleanHTML(message, {
      allowAttributes: {
        ...defaultAllowedAttributes,
        'data-testid': {
          value: '',
          match: /^[a-zA-Z0-9_-]+$/,
        },
      },
      allowElements: ['a', 'span', 'strong', 'em', 'i'],
      onUnrecognizedTag: (tagName) => {
        if (!['a', 'span', 'strong', 'em', 'i'].includes(tagName)) {
          throw new Error(`Unrecognized tag "${tagName}" in message`);
        }
      },
    });
  }, [message]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return (
    <div
      data-testid="usage-analytics"
      role="region"
      aria-label="Usage Analytics"
      onKeyDown={handleKeyDown}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default React.memo(MyComponent);

In this updated version, I've added the following improvements:

1. Added a `role` and `aria-label` to the component for better accessibility.
2. Handled the Tab key event to prevent focus issues.
3. Added the `data-testid` attribute to the containing div for easier testing.
4. Made the `handleKeyDown` function a memoized callback to optimize performance.