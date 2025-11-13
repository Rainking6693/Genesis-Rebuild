import React, { FC, ReactNode, RefObject, useEffect } from 'react';
import { sanitizeUserInput } from 'security-utils';
import { optimizedComponent } from 'performance-utils';

interface Props {
  message: string;
  children?: ReactNode;
}

const ReferralSystemMessage: FC<Props> = ({ message, children }) => {
  const referralLinkRef: RefObject<HTMLAnchorElement> = React.useRef(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (referralLinkRef.current) {
      referralLinkRef.current.blur();
      referralLinkRef.current.focus();
      referralLinkRef.current.click();
    }
  };

  const sanitizedMessage = sanitizeUserInput(message);

  // Focus the referral link when the component mounts, ensuring it's focused even when JavaScript is enabled.
  useEffect(() => {
    if (referralLinkRef.current) {
      referralLinkRef.current.focus();
    }
  }, []);

  return (
    <div className="review-rocket-referral-message" role="alert" aria-live="polite">
      {/* Wrap the message content with dangerouslySetInnerHTML to prevent potential XSS attacks */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
      <a
        href="#"
        ref={referralLinkRef}
        onClick={handleClick}
        className="referral-link"
        tabIndex={-1}
      >
        Refer a friend and get rewards
      </a>
    </div>
  );
};

export default optimizedComponent(ReferralSystemMessage);

In this updated code:

1. I added a `useEffect` hook to focus the referral link when the component mounts, ensuring it's focused even when JavaScript is enabled.
2. I added an `aria-live` attribute to the message container to improve accessibility. The `polite` value means that the message will be announced once and then remain available for future updates.
3. I added a comment to explain the purpose of the `useEffect` hook.
4. I updated the `role` attribute to `alert` to better indicate the purpose of the message container.