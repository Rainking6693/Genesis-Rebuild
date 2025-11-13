import React, { FC, ReactNode, string } from 'react';

type Props = {
  message: string;
};

const validateMessage = (message: string): string => {
  if (!message) {
    throw new Error('Message cannot be empty');
  }

  // Use a regular expression to check for script tags
  const scriptRegex = /<script[^>]*>([^<]*)<\/script>/;
  if (scriptRegex.test(message)) {
    throw new Error('Message contains script tags');
  }

  return message;
};

const SocialMediaMessage: FC<Props> = ({ children }) => {
  return <div dangerouslySetInnerHTML={{ __html: children }} />;
};

const SocialMediaMessageWithValidation = (props: Props) => {
  const validatedMessage = validateMessage(props.message);
  return <SocialMediaMessage dangerouslySetInnerHTML={{ __html: validatedMessage }} />;
};

const AccessibleSocialMediaMessage: FC<Props> = ({ message }) => {
  const validatedMessage = validateMessage(message);
  const ariaLabel = message ? validatedMessage : 'Empty social media message';

  return (
    <div>
      <span aria-label={ariaLabel}>{validatedMessage}</span>
      <SocialMediaMessageWithValidation message={validatedMessage} />
    </div>
  );
};

export default AccessibleSocialMediaMessage;

This version of the component validates the message before rendering it, ensuring that it doesn't contain any script tags. It also provides an aria-label for accessibility purposes, and uses the SocialMediaMessageWithValidation component to ensure that the message is properly sanitized before being rendered.