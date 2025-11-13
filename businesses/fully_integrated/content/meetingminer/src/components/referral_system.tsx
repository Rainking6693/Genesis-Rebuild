import React, { FC, useMemo, useRef } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { MessageId, Message } from './types';

// Type for Message interface
interface Message {
  id: MessageId;
  content: string;
}

// Component for displaying a referral message
const ReferralMessage: FC<Message> = ({ id, content }) => {
  // Ensure user input is sanitized to prevent XSS attacks
  const safeMessageRef = useRef<HTMLDivElement>(null);
  const safeMessage = useMemo(() => sanitizeUserInput(content), [content]);

  // Add ARIA attributes for accessibility
  const referralMessageId = `referral-message-${id}`;

  // Set the aria-labelledby attribute to the message id
  React.useEffect(() => {
    if (safeMessageRef.current) {
      safeMessageRef.current.setAttribute('aria-labelledby', referralMessageId);
    }
  }, [safeMessageRef, referralMessageId]);

  return (
    <div id={referralMessageId}>
      <div ref={safeMessageRef} dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

// Handle invalid user input by returning an empty message
ReferralMessage.defaultProps = {
  id: '',
  content: '',
};

export default ReferralMessage;

import React, { FC, useMemo, useRef } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { MessageId, Message } from './types';

// Type for Message interface
interface Message {
  id: MessageId;
  content: string;
}

// Component for displaying a referral message
const ReferralMessage: FC<Message> = ({ id, content }) => {
  // Ensure user input is sanitized to prevent XSS attacks
  const safeMessageRef = useRef<HTMLDivElement>(null);
  const safeMessage = useMemo(() => sanitizeUserInput(content), [content]);

  // Add ARIA attributes for accessibility
  const referralMessageId = `referral-message-${id}`;

  // Set the aria-labelledby attribute to the message id
  React.useEffect(() => {
    if (safeMessageRef.current) {
      safeMessageRef.current.setAttribute('aria-labelledby', referralMessageId);
    }
  }, [safeMessageRef, referralMessageId]);

  return (
    <div id={referralMessageId}>
      <div ref={safeMessageRef} dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

// Handle invalid user input by returning an empty message
ReferralMessage.defaultProps = {
  id: '',
  content: '',
};

export default ReferralMessage;