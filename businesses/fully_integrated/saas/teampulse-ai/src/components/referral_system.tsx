import React, { FC, useId, useState } from 'react';

interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const referralMessageId = useId();

  // Ensure the unique ID is loaded before rendering the component
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div>
      {/* Add a unique ID for each referral message for tracking purposes */}
      <div id={referralMessageId}>
        {message}
      </div>

      {/* Add a link to the referral program terms and conditions */}
      <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" aria-label="Learn more about our referral program">
        Learn more
      </a>

      {/* Add a screen reader-friendly label for the link */}
      <span id={`${referralMessageId}-sr`} className="sr-only">
        Learn more about our referral program
      </span>
    </div>
  );
};

export default ReferralMessage;

In this updated version, I've added a state variable `isLoaded` to ensure the component is only rendered after the unique ID has been generated. This helps avoid potential issues with the component rendering before the unique ID is available. Additionally, I've added a `useEffect` hook to set `isLoaded` to `true` once the component is mounted, ensuring the unique ID is available before the component is rendered. This improves the resiliency and maintainability of the component.

I've also added a null check for the `isLoaded` state before rendering the component, which helps handle edge cases where the component might not be ready to render. This further improves the resiliency of the component.

Lastly, I've added a `target="_blank"` attribute to the link to ensure it opens in a new tab, improving the user experience.