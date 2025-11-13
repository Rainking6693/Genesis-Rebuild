import React, { ReactElement } from 'react';
import { EcoTrackProBranding } from '../../branding';

interface Props {
  subject?: string;
  preheader?: string;
  fromName?: string;
  fromEmail?: string;
  to?: string;
  message?: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
}

const isValidEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const MyComponent: React.FC<Props> = ({
  subject = '',
  preheader = '',
  fromName = '',
  fromEmail = '',
  to = '',
  cc = '',
  bcc = '',
  replyTo = '',
  message = '',
}) => {
  const normalizedFromEmail = fromEmail?.toLowerCase().trim();
  const normalizedTo = to?.toLowerCase().trim();
  const normalizedCc = cc?.toLowerCase().trim();
  const normalizedBcc = bcc?.toLowerCase().trim();
  const normalizedReplyTo = replyTo?.toLowerCase().trim();

  if (!isValidEmail(normalizedFromEmail)) {
    throw new Error('Invalid from email address');
  }

  if (!isValidEmail(normalizedTo)) {
    throw new Error('Invalid to email address');
  }

  if (normalizedCc && !isValidEmail(normalizedCc)) {
    throw new Error('Invalid cc email address');
  }

  if (normalizedBcc && !isValidEmail(normalizedBcc)) {
    throw new Error('Invalid bcc email address');
  }

  if (normalizedReplyTo && !isValidEmail(normalizedReplyTo)) {
    throw new Error('Invalid reply-to email address');
  }

  return (
    <div>
      <EcoTrackProBranding emailSubject={subject} emailPreheader={preheader} />
      <div>From: {fromName} <{normalizedFromEmail}></div>
      {cc && <div>Cc: {normalizedCc}</div>}
      {bcc && <div>Bcc: {normalizedBcc}</div>}
      <div>To: {normalizedTo}</div>
      {replyTo && <div>Reply-to: {normalizedReplyTo}</div>}
      <div>{message}</div>
    </div>
  );
};

export default MyComponent;

In this version, I added optional properties for cc, bcc, and replyTo to handle edge cases where these properties might not be provided. I also normalized these properties to lowercase and trimmed whitespace for better comparison and consistency. Additionally, I added email validation for the cc, bcc, and replyTo properties to ensure that they are valid email addresses.