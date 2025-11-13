import React, { memo, FC, ReactNode } from 'react';

interface MeetingRecordingComponentProps {
  meetingTitle?: string;
  meetingContent?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MeetingRecordingComponent: FC<MeetingRecordingComponentProps> = memo(
  ({
    meetingTitle = '',
    meetingContent = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    className = '',
  }) => {
    const titleElement: ReactNode = meetingTitle ? (
      <h1 data-testid="meeting-title">{meetingTitle}</h1>
    ) : null;

    const contentElement: ReactNode = meetingContent ? (
      <p data-testid="meeting-content">{meetingContent}</p>
    ) : null;

    return (
      <div
        data-testid="meeting-recording-component"
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {titleElement}
        {contentElement}
      </div>
    );
  }
);

export default MeetingRecordingComponent;

import React, { memo, FC, ReactNode } from 'react';

interface MeetingRecordingComponentProps {
  meetingTitle?: string;
  meetingContent?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MeetingRecordingComponent: FC<MeetingRecordingComponentProps> = memo(
  ({
    meetingTitle = '',
    meetingContent = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    className = '',
  }) => {
    const titleElement: ReactNode = meetingTitle ? (
      <h1 data-testid="meeting-title">{meetingTitle}</h1>
    ) : null;

    const contentElement: ReactNode = meetingContent ? (
      <p data-testid="meeting-content">{meetingContent}</p>
    ) : null;

    return (
      <div
        data-testid="meeting-recording-component"
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {titleElement}
        {contentElement}
      </div>
    );
  }
);

export default MeetingRecordingComponent;