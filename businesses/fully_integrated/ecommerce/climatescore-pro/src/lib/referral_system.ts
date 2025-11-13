import React, { FC, ReactNode, DefaultProps, PropsWithChildren } from 'react';

interface Props extends DefaultProps {
  message?: string;
  children?: ReactNode;
}

const ReferralMessage: FC<Props> = ({ children, ...rest }) => {
  const message = children || rest.message || 'Welcome to ClimateScore Pro! Refer a friend and help us build a greener future.';

  return (
    <div role="alert">
      {message}
      <br />
      <small role="note">
        Refer a friend and get a discount on your next purchase.
      </small>
    </div>
  );
};

ReferralMessage.defaultProps = {
  message: 'Welcome to ClimateScore Pro! Refer a friend and help us build a greener future.',
};

// Use React.memo for performance optimization
const MemoizedReferralMessage = React.memo(ReferralMessage);

// Add support for passing additional props as children
const WithChildrenReferralMessage = (props: PropsWithChildren<Props>) => {
  return <MemoizedReferralMessage {...props}>{props.children}</MemoizedReferralMessage>;
};

// Handle empty message case
const EmptyReferralMessage: FC<Props> = () => {
  return <div role="alert">No referral message provided.</div>;
};

// Add a prop to control whether to show the default message or not
const ControllableReferralMessage: FC<Props> = ({ message, showDefaultMessage = true, ...rest }) => {
  const referralMessage = message || (showDefaultMessage ? ReferralMessage.defaultProps.message : undefined);

  if (!referralMessage) {
    return <EmptyReferralMessage />;
  }

  return <WithChildrenReferralMessage {...rest}>{referralMessage}</WithChildrenReferralMessage>;
};

export { MemoizedReferralMessage, WithChildrenReferralMessage, ControllableReferralMessage, EmptyReferralMessage };

In this updated code, I've made the following changes:

1. Made the `message` prop optional and added a `children` prop to support passing additional content.
2. Added proper HTML semantics (`<div role="alert">` for the main content and `<small role="note">` for the secondary information) for accessibility.
3. Added an `EmptyReferralMessage` component to handle the case when no message is provided.
4. Created a `ControllableReferralMessage` component that allows controlling whether to show the default message or not. This can be useful for cases where you want to disable the default message and provide a custom one.