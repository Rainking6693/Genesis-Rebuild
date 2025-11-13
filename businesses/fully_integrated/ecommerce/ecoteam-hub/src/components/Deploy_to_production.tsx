import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = React.memo(({ message }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&([a-zA-Z]{1,5})?;/g, (_, entity) => {
      switch (entity) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        default:
          return entity;
      }
    });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = React.memo(({ message }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&([a-zA-Z]{1,5})?;/g, (_, entity) => {
      switch (entity) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        default:
          return entity;
      }
    });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;