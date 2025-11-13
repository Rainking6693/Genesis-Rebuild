import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  referralCode?: string;
}

const ReferralMessage: FC<Props> = ({ message, referralCode }) => {
  return (
    <a href={`https://www.reviewflow.ai/refer?ref=${referralCode || ''}`}>
      {message}
    </a>
  );
};

let uniqueIdentifierCounter = 1;
const generateUniqueIdentifier = () => `user_${uniqueIdentifierCounter++}`;

const identifiersMap = new Map<string, boolean>();

export const ReferralSystem = () => {
  const [referralMessage, setReferralMessage] = useState('Refer a friend to ReviewFlow AI and get a 10% discount!');

  const handleGenerateReferralLink = () => {
    let newIdentifier = generateUniqueIdentifier();
    while (identifiersMap.has(newIdentifier)) {
      newIdentifier = generateUniqueIdentifier();
    }
    setReferralMessage(`Refer a friend to ReviewFlow AI using this link: <ReferralMessage referralCode={"${newIdentifier}"} />`);
    identifiersMap.set(newIdentifier, true);
  };

  useEffect(() => {
    return () => {
      identifiersMap.clear();
    };
  }, []);

  return (
    <div>
      <button aria-label="Generate Referral Link">Generate Referral Link</button>
      {referralMessage}
    </div>
  );
};

In this improved version, I've made the following changes:

1. Added a `referralCode` prop to the `ReferralMessage` component to allow passing the unique identifier.
2. Implemented a counter to generate unique identifiers instead of using `Math.random()`. This ensures that the generated identifiers are more predictable and less likely to collide.
3. Created a `identifiersMap` to store used identifiers and prevent duplicate identifiers from being generated.
4. Added error handling for generating unique identifiers. If a duplicate identifier is found, the function will retry until a unique identifier is generated.
5. Added a cleanup function to the `useEffect` hook to clear the `identifiersMap` when the component unmounts. This helps prevent memory leaks.
6. Made the component more accessible by adding an `aria-label` to the button.
7. Used template literals to concatenate strings in the `handleGenerateReferralLink` function and the `referralMessage` state. This makes the code more readable and easier to maintain.