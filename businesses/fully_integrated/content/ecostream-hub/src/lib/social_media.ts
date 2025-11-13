import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

interface Props {
  message?: string;
  className?: string;
  maxWidth?: string;
  testID?: string;
  children?: ReactNode;
}

const SocialMediaComponent: FC<Props> = ({
  message,
  className,
  maxWidth,
  testID,
  children,
}) => {
  const socialMediaClasses = classnames('ecostream-social-media', className, {
    [`ecostream-social-media-max-width-${maxWidth}`]: maxWidth,
  });

  if (children) {
    return (
      <div data-testid={testID} className={socialMediaClasses}>
        {children}
      </div>
    );
  }

  return (
    <p role="text" aria-label="Social media message" className={socialMediaClasses}>
      {message || 'Welcome to EcoStream Hub! Discover sustainable brands and personalized content here.'}
    </p>
  );
};

SocialMediaComponent.displayName = 'SocialMediaComponent';

SocialMediaComponent.defaultProps = {
  message: 'Welcome to EcoStream Hub! Discover sustainable brands and personalized content here.',
  maxWidth: '500',
};

SocialMediaComponent.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  maxWidth: PropTypes.string,
  testID: PropTypes.string,
  children: PropTypes.node,
};

// Import PropTypes for validation
import PropTypes from 'prop-types';

// Import classnames for managing classes
import classnames from 'classnames';

// Add accessibility by wrapping the message in a paragraph tag
const AccessibleSocialMediaComponent: FC<Props> = ({ message, className, maxWidth, testID, children }) => {
  const socialMediaClasses = classnames('ecostream-social-media', className, {
    [`ecostream-social-media-max-width-${maxWidth}`]: maxWidth,
  });

  if (children) {
    return (
      <div data-testid={testID} className={socialMediaClasses}>
        {children}
      </div>
    );
  }

  return (
    <p role="text" aria-label="Social media message" className={socialMediaClasses}>
      {message || 'Welcome to EcoStream Hub! Discover sustainable brands and personalized content here.'}
    </p>
  );
};

// Export both the original and accessible versions
export { SocialMediaComponent, AccessibleSocialMediaComponent };

This updated code allows for more flexibility in terms of styling, testing, and content. The `maxWidth` prop allows for responsive design, the `testID` prop makes testing easier, and the `children` prop allows for more complex content. The accessibility improvements remain in place with the `<p>` tag and the added `role` and `aria-label` attributes.