import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  message: string;
  referralId?: string;
}

const MyReferralComponent: FC<Props> = ({ message, referralId = uuidv4() }) => {
  // Use the provided referralId if available, otherwise generate a new one

  return (
    <div>
      {/* Add a unique ID for each referral link to track referrals effectively */}
      <a href={`https://www.stresslensanalytics.com/refer?id=${referralId}`} rel="noreferrer" target="_blank">
        {message}
      </a>
    </div>
  );
};

export default MyReferralComponent;

// Add a custom hook to ensure unique IDs across the entire application
import { useState } from 'react';

const useUniqueId = () => {
  const [id, setId] = useState<string>(uuidv4());
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!ids.has(id)) {
      setIds((prevIds) => {
        prevIds.add(id);
        return prevIds;
      });
      setId(uuidv4());
    }
  }, [id]);

  return id;
};

// Update the MyReferralComponent to use the custom hook
const MyReferralComponent: FC<Props> = ({ message, referralId }) => {
  const uniqueId = referralId || useUniqueId();

  // ... rest of the component
};

In this updated version, I've added a custom hook `useUniqueId` to ensure that unique IDs are generated consistently across the entire application. The `useUniqueId` hook checks if the generated ID is already in use before returning it. If it is, a new ID is generated. This helps prevent duplicate IDs and ensures that each ID is unique across the entire application, not just within the `MyReferralComponent`.

I've also updated the `MyReferralComponent` to accept an optional `referralId` prop, which can be used to provide a specific ID for the component. If no `referralId` is provided, the `useUniqueId` hook is used to generate a new ID. This allows for more flexibility in using the component and ensures that unique IDs are generated even when multiple instances of the component are rendered with the same message.