import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message: string;
  testId?: string;
  children?: ReactNode;
}

const MyEmailComponent: FC<Props> = ({ subject = 'Untitled Email', message, testId, children }) => {
  return (
    <div data-testid={testId} role="listitem">
      <h2 role="heading" aria-level={2} id={`email-subject-${testId}`}>{subject}</h2>
      <div className="email-content" role="article">
        {children || message}
      </div>
    </div>
  );
};

export default MyEmailComponent;

Changes made:

1. Added `ReactNode` to the props for better type safety and flexibility.
2. Added a `children` prop to allow for more complex content structures.
3. Added an `id` attribute to the subject heading for better accessibility and screen reader support.
4. Changed the `div` wrapping the email content to have a `role="article"` for better semantic structure.
5. Changed the root `div` to have a `role="listitem"` to better represent the email as a list item in a larger context.