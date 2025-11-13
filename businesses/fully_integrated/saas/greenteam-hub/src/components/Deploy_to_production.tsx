import React, { FC, useCallback } from 'react';
import { jsx, jsxs, Fragment } from 'jsx-safe-string';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitize = useCallback((html: string) => {
    // Sanitize user-provided HTML here (e.g., using DOMPurify)
    return html;
  }, []);

  return jsx("div", {}, sanitize(message));
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, useCallback } from 'react';
import { jsx, jsxs, Fragment } from 'jsx-safe-string';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitize = useCallback((html: string) => {
    // Sanitize user-provided HTML here (e.g., using DOMPurify)
    return html;
  }, []);

  return jsx("div", {}, sanitize(message));
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

Then, update your component as follows: