import React, { FC, useMemo, ReactNode, DefaultHTMLProps, PropsWithChildren } from 'react';

interface Props extends DefaultHTMLProps<HTMLArticleElement> {
  referralMessage: string; // Use a more descriptive name to reflect the business context
}

const ReferralComponent: FC<Props> = ({ children, referralMessage, ...rest }) => {
  const memoizedComponent = useMemo(() => children, [children, referralMessage]); // Include children and referralMessage in the dependency array

  const handleMissingOrInvalidReferralMessage = (message: string) => {
    if (!message) {
      throw new Error('Referral message is required');
    }
    // Add additional validation checks as needed
  };

  useMemo(() => {
    handleMissingOrInvalidReferralMessage(referralMessage);
  }, [referralMessage]); // Validate referralMessage on mount and update

  return <article {...rest} role="presentation" aria-label="Referral Message">{memoizedComponent}</article>;
};

ReferralComponent.defaultProps = {
  children: 'Refer a friend and get rewards!', // Provide a default message for cases where no specific message is provided
  referralMessage: 'Refer a friend and get rewards!',
};

ReferralComponent.displayName = 'ReferralComponent'; // Improve readability and maintainability

export default ReferralComponent;

In this version, I've added the ability to pass custom attributes to the `<article>` element using the spread operator (`...rest`). I've also made the `children` prop optional by providing a default value, so you can pass custom content if needed. Additionally, I've moved the validation of the `referralMessage` to the `useMemo` hook, ensuring that it's validated on mount and update.