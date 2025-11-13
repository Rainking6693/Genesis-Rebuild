import React, { FC, useId } from 'react';

interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const id = useId(); // Generate a unique ID for each referral message

  return (
    <div>
      {/* Add a unique ID for each referral message to enable tracking and analytics */}
      <div id={id}>
        {message}
      </div>

      {/* Add a link to the referral program terms and conditions */}
      <a href="/terms-and-conditions" aria-label="Learn more about our referral program">
        Learn more about our referral program
      </a>

      {/* Add a role attribute to the link for better accessibility */}
      <a href="/terms-and-conditions" role="button">
        Learn more about our referral program (focusable)
      </a>
    </div>
  );
};

export default ReferralMessage;

In this updated version, I've used the `useId` hook from React to generate a unique ID for each referral message. This ensures that the IDs are unique even if multiple messages are rendered simultaneously.

I've also added an `aria-label` attribute to the link for better accessibility, and a `role="button"` attribute to make the link focusable. This is important for users navigating with a keyboard or screen readers.

Lastly, I've added a secondary link with the same content for better accessibility and usability. The secondary link has a different label and role to provide more context to users.