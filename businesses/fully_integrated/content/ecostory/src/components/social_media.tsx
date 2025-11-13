import React, { forwardRef, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface SocialMediaRectangleProps extends HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
}

const SocialMediaRectangle = forwardRef<HTMLDivElement, SocialMediaRectangleProps>((props, ref) => {
  const { width, height, className, style, children, ...rest } = props;

  // Ensure width and height are positive numbers
  const normalizedWidth = Math.max(0, width);
  const normalizedHeight = Math.max(0, height);

  // Add a role attribute for accessibility
  const role = 'presentation';
  if (!props.role) {
    rest.role = role;
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={`social-media-rectangle ${className}`}
      style={{
        ...style,
        width: `${normalizedWidth}px`,
        height: `${normalizedHeight}px`,
      }}
    >
      {children}
    </div>
  );
});

SocialMediaRectangle.displayName = 'SocialMediaRectangle';
SocialMediaRectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  role: PropTypes.string,
};

export default SocialMediaRectangle;

import React, { forwardRef, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface SocialMediaRectangleProps extends HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
}

const SocialMediaRectangle = forwardRef<HTMLDivElement, SocialMediaRectangleProps>((props, ref) => {
  const { width, height, className, style, children, ...rest } = props;

  // Ensure width and height are positive numbers
  const normalizedWidth = Math.max(0, width);
  const normalizedHeight = Math.max(0, height);

  // Add a role attribute for accessibility
  const role = 'presentation';
  if (!props.role) {
    rest.role = role;
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={`social-media-rectangle ${className}`}
      style={{
        ...style,
        width: `${normalizedWidth}px`,
        height: `${normalizedHeight}px`,
      }}
    >
      {children}
    </div>
  );
});

SocialMediaRectangle.displayName = 'SocialMediaRectangle';
SocialMediaRectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  role: PropTypes.string,
};

export default SocialMediaRectangle;