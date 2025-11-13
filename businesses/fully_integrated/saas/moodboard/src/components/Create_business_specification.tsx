import React, { FC, ReactNode } from 'react';
import { MoodBoardMessage } from './MoodBoardMessage';

interface MoodBoardMessage {
  text: string;
  title?: string;
  timestamp: Date;
  senderId?: string;
  isAnonymous?: boolean;
  moodLevel?: number;
}

const validSenderId = (senderId: string | undefined): senderId is string =>
  typeof senderId === 'string' && senderId.length > 0;

const validIsAnonymous = (isAnonymous: boolean | undefined): isAnonymous is boolean =>
  typeof isAnonymous === 'boolean';

const validMoodLevel = (moodLevel: number | undefined): moodLevel is number =>
  typeof moodLevel === 'number' && moodLevel >= 1 && moodLevel <= 5;

const MyComponent: FC<{ moodBoardMessage?: MoodBoardMessage }> = ({ moodBoardMessage }) => {
  if (!moodBoardMessage || !moodBoardMessage.text) return null;

  const { text, title, senderId, isAnonymous, moodLevel, timestamp } = moodBoardMessage;

  if (!validSenderId(senderId)) {
    return <div>Invalid senderId value: {senderId}</div>;
  }

  if (!validIsAnonymous(isAnonymous)) {
    return <div>Invalid isAnonymous value: {isAnonymous}</div>;
  }

  if (!validMoodLevel(moodLevel)) {
    moodLevel = 3; // Default value for moodLevel in case of an error
  }

  return (
    <div className="my-component" aria-label="Mood board message">
      <MoodBoardMessageMessage
        moodBoardMessage={{
          text,
          title: title || 'Mood board message', // Default title for better accessibility
          senderId,
          isAnonymous,
          moodLevel,
          timestamp,
        }}
      />
    </div>
  );
};

const MoodBoardMessageMessage: FC<MoodBoardMessage> = ({ text, title, senderId, isAnonymous, moodLevel, timestamp }) => {
  return (
    <div role="presentation" title={title}>
      {text}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import { MoodBoardMessage } from './MoodBoardMessage';

interface MoodBoardMessage {
  text: string;
  title?: string;
  timestamp: Date;
  senderId?: string;
  isAnonymous?: boolean;
  moodLevel?: number;
}

const validSenderId = (senderId: string | undefined): senderId is string =>
  typeof senderId === 'string' && senderId.length > 0;

const validIsAnonymous = (isAnonymous: boolean | undefined): isAnonymous is boolean =>
  typeof isAnonymous === 'boolean';

const validMoodLevel = (moodLevel: number | undefined): moodLevel is number =>
  typeof moodLevel === 'number' && moodLevel >= 1 && moodLevel <= 5;

const MyComponent: FC<{ moodBoardMessage?: MoodBoardMessage }> = ({ moodBoardMessage }) => {
  if (!moodBoardMessage || !moodBoardMessage.text) return null;

  const { text, title, senderId, isAnonymous, moodLevel, timestamp } = moodBoardMessage;

  if (!validSenderId(senderId)) {
    return <div>Invalid senderId value: {senderId}</div>;
  }

  if (!validIsAnonymous(isAnonymous)) {
    return <div>Invalid isAnonymous value: {isAnonymous}</div>;
  }

  if (!validMoodLevel(moodLevel)) {
    moodLevel = 3; // Default value for moodLevel in case of an error
  }

  return (
    <div className="my-component" aria-label="Mood board message">
      <MoodBoardMessageMessage
        moodBoardMessage={{
          text,
          title: title || 'Mood board message', // Default title for better accessibility
          senderId,
          isAnonymous,
          moodLevel,
          timestamp,
        }}
      />
    </div>
  );
};

const MoodBoardMessageMessage: FC<MoodBoardMessage> = ({ text, title, senderId, isAnonymous, moodLevel, timestamp }) => {
  return (
    <div role="presentation" title={title}>
      {text}
    </div>
  );
};

export default MyComponent;