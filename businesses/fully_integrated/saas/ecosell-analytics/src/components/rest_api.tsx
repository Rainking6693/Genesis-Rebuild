import React, { FC, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';
import { isEmpty } from 'lodash';

interface Props {
  message: string;
}

const sanitize = (message: string) => {
  const allowedTags = ['div'];
  return sanitizeHtml(message, { allowedTags, transformEmptyElements: { div: true } });
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    if (!isEmpty(message)) {
      setSanitizedMessage(sanitize(message));
    }
  }, [message]);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={message}
        data-testid="my-component" // Added for testing purposes
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;

1. I've added the `isEmpty` function from the `lodash` library to check if the `message` prop is empty before setting the sanitized message. This prevents unnecessary re-renders when the `message` prop is empty.

2. I've used the `useState` hook to manage the `sanitizedMessage` state instead of using `useMemo`. This allows the component to update when the `message` prop changes.

3. I've added an `useEffect` hook to update the `sanitizedMessage` state when the `message` prop changes.

4. I've added an `aria-label` to the sanitized HTML for better accessibility.

5. I've added a `data-testid` attribute for easier testing purposes.