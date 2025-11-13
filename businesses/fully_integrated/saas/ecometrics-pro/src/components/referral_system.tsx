import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitize } from 'some-security-library';

type SanitizeFunction = (input: string) => string;
type Props = {
  message: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function generateUniqueKey(Component: any) {
  return Component.displayName || `Component-${Math.random().toString(36).substring(2)}`;
}

const ReferralSystemMessage: FC<Props> = ({ message, id, ...htmlAttributes }) => {
  const sanitizedMessage = sanitize(message) || 'Invalid message';

  if (!sanitizedMessage) {
    return null;
  }

  return (
    <div
      className="referral-system-message"
      {...htmlAttributes}
      key={htmlAttributes.id || generateUniqueKey(ReferralSystemMessage)}
      aria-label="Referral system message"
      role="alert"
    >
      {sanitizedMessage}
    </div>
  );
};

export default ReferralSystemMessage;

This updated code addresses the issues mentioned and improves the overall quality of the component.