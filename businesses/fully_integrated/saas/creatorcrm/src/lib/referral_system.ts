import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  dataTestid?: string;
}

const ReferralSystemMessage: FC<Props> = ({ className, message, dataTestid, ...rest }) => {
  // Add ARIA attributes for accessibility
  const ariaLabel = 'Referral system message';
  const ariaLabelledBy = dataTestid || 'referral-system-message';

  return (
    <div
      className={className}
      data-testid={dataTestid}
      {...rest}
      role="alert"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {message && message.length > 0 && message}
    </div>
  );
};

ReferralSystemMessage.defaultProps = {
  className: 'referral-message',
  message: 'Welcome! Refer a friend and earn rewards.',
  dataTestid: 'referral-system-message',
};

ReferralSystemMessage.propTypes = {
  message: PropTypes.string,
  dataTestid: PropTypes.string,
};

export { ReferralSystemMessage };

In this updated version, I've added the following improvements:

1. Added support for the `data-testid` attribute for easier testing.
2. Added a check for the `message` prop to ensure it's not an empty string.
3. Added a `role` attribute to improve accessibility.
4. Improved the organization of the defaultProps object by separating the `dataTestid` property.
5. Renamed the `ariaDescription` to `ariaLabelledBy` for better accessibility.