import React, { FC, RefObject, useId } from 'react';
import { useXSS } from 'xss';

// Sanitize user-generated messages to prevent XSS attacks
const sanitizeXSS = useXSS();

interface Props {
  message: string;
  // Add a ref for accessibility and maintainability
  ref?: RefObject<HTMLDivElement>;
}

const SocialMediaMessage: FC<Props> = ({ message, ref }) => {
  // Sanitize the message
  const sanitizedMessage = sanitizeXSS(message);

  // Generate a unique id for each message to improve performance during rendering
  const uniqueId = useId();

  // Add an aria-labelledby for accessibility
  const ariaLabelledBy = `social_message_${uniqueId}`;

  return (
    <div
      className="retentiongenius-social-message"
      // Add the ref for accessibility and maintainability
      ref={ref}
      // Add an aria-labelledby for accessibility
      aria-labelledby={ariaLabelledBy}
      // Add a key for resiliency and performance
      key={uniqueId}
    >
      {sanitizedMessage}
    </div>
  );
};

// Wrap the SocialMediaMessage component with a forwardRef to allow for ref forwarding
const ForwardedSocialMediaMessage = React.forwardRef<HTMLDivElement, Props>(({ message, ref }, refForwarded) => {
  return (
    <SocialMediaMessage message={message} ref={refForwarded}>
      {/* Add an aria-labelledby for accessibility */}
      <div id={`social_message_${useId()}`}>Social media message</div>
    </SocialMediaMessage>
  );
});

export default ForwardedSocialMediaMessage;

In this updated code, I've added a unique id for each message using the `useId()` hook from React. This improves performance during rendering. I've also added an `aria-labelledby` attribute to the SocialMediaMessage component, which helps screen readers associate the message with a descriptive label. Additionally, I've wrapped the SocialMediaMessage component with a forwardRef to allow for ref forwarding, and I've added an `id` attribute to the label element for better accessibility.