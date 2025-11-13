import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'react-helmet-sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const FunctionalComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'aria-label'],
      p: ['aria-label'],
    },
  });

  return (
    <div {...rest} className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

FunctionalComponent.defaultProps = {
  className: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FunctionalComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'react-helmet-sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const FunctionalComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'aria-label'],
      p: ['aria-label'],
    },
  });

  return (
    <div {...rest} className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

FunctionalComponent.defaultProps = {
  className: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FunctionalComponent;