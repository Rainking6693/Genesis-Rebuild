import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

type SocialMediaPostProps = DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children?: ReactNode;
  message?: string;
  className?: string;
};

const SocialMediaPost: FunctionComponent<SocialMediaPostProps> = ({ children, message, className, ...rest }) => {
  const finalMessage = message || (children as string);

  return (
    <div className={classnames('social-media-post', className)} {...rest}>
      {finalMessage}
    </div>
  );
};

SocialMediaPost.defaultProps = {
  message: 'Default social media post message',
};

SocialMediaPost.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default SocialMediaPost;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

type SocialMediaPostProps = DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children?: ReactNode;
  message?: string;
  className?: string;
};

const SocialMediaPost: FunctionComponent<SocialMediaPostProps> = ({ children, message, className, ...rest }) => {
  const finalMessage = message || (children as string);

  return (
    <div className={classnames('social-media-post', className)} {...rest}>
      {finalMessage}
    </div>
  );
};

SocialMediaPost.defaultProps = {
  message: 'Default social media post message',
};

SocialMediaPost.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default SocialMediaPost;