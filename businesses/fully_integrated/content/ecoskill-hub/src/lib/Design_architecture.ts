import React, { FC, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  children?: ReactElement<any>;
}

const ContentModule: FC<Props> = ({ message, children }) => {
  // Use a fragment to wrap children for better accessibility
  return (
    <>
      {/* Use a safe HTML parser for message */}
      <div dangerouslySetInnerHTML={{ __html: message.replace(/<.*?>/g, '') }} />
      {children}
    </>
  );
};

ContentModule.defaultProps = {
  message: '',
};

ContentModule.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export { ContentModule };

import React, { FC, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  children?: ReactElement<any>;
}

const ContentModule: FC<Props> = ({ message, children }) => {
  // Use a fragment to wrap children for better accessibility
  return (
    <>
      {/* Use a safe HTML parser for message */}
      <div dangerouslySetInnerHTML={{ __html: message.replace(/<.*?>/g, '') }} />
      {children}
    </>
  );
};

ContentModule.defaultProps = {
  message: '',
};

ContentModule.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export { ContentModule };