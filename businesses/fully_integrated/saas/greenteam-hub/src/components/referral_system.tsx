import React, { FC, ReactNode, DefaultHTMLProps, PropsWithChildren, useId } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  /**
   * The referral message to be displayed in the GreenTeam Hub context.
   */
  referralMessage: string;

  /**
   * Additional classes to be applied to the referral message container.
   */
  className?: string;

  /**
   * Accessibility label for the referral message.
   */
  accessibilityLabel?: string;

  /**
   * Optional id for the referral message container. If not provided, a unique id will be generated.
   */
  id?: string;
}

const ReferralMessageComponent: FC<Props> = ({
  referralMessage,
  className,
  accessibilityLabel,
  id,
  ...rest
}) => {
  const messageId = id || useId();

  return (
    <div id={messageId} className={className} {...rest} aria-label={accessibilityLabel}>
      {referralMessage}
    </div>
  );
};

// Add error handling for potential missing or invalid props
const defaultProps: Props = {
  referralMessage: 'Refer a friend and earn rewards!',
  className: '',
  accessibilityLabel: 'Referral message',
  id: undefined,
};

ReferralMessageComponent.defaultProps = defaultProps;

// Use React.memo for performance optimization when the prop is not expected to change frequently
const MemoizedReferralMessageComponent = React.memo(ReferralMessageComponent);

export default MemoizedReferralMessageComponent;

import React, { FC, ReactNode, DefaultHTMLProps, PropsWithChildren, useId } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  /**
   * The referral message to be displayed in the GreenTeam Hub context.
   */
  referralMessage: string;

  /**
   * Additional classes to be applied to the referral message container.
   */
  className?: string;

  /**
   * Accessibility label for the referral message.
   */
  accessibilityLabel?: string;

  /**
   * Optional id for the referral message container. If not provided, a unique id will be generated.
   */
  id?: string;
}

const ReferralMessageComponent: FC<Props> = ({
  referralMessage,
  className,
  accessibilityLabel,
  id,
  ...rest
}) => {
  const messageId = id || useId();

  return (
    <div id={messageId} className={className} {...rest} aria-label={accessibilityLabel}>
      {referralMessage}
    </div>
  );
};

// Add error handling for potential missing or invalid props
const defaultProps: Props = {
  referralMessage: 'Refer a friend and earn rewards!',
  className: '',
  accessibilityLabel: 'Referral message',
  id: undefined,
};

ReferralMessageComponent.defaultProps = defaultProps;

// Use React.memo for performance optimization when the prop is not expected to change frequently
const MemoizedReferralMessageComponent = React.memo(ReferralMessageComponent);

export default MemoizedReferralMessageComponent;