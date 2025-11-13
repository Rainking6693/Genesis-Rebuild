import React, { FC, ReactNode, useId } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  return (
    <div data-testid={id}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Adding a screen reader-friendly label for accessibility */}
      <div id={id} style={{ position: 'absolute', width: 1, height: 1, margin: -1 }}>
        {sanitizedMessage}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useId } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  return (
    <div data-testid={id}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Adding a screen reader-friendly label for accessibility */}
      <div id={id} style={{ position: 'absolute', width: 1, height: 1, margin: -1 }}>
        {sanitizedMessage}
      </div>
    </div>
  );
};

export default MyComponent;