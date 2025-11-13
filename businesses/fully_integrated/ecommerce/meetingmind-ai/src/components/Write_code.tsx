import React, { memo, useMemo } from 'react';

interface MeetingMindProps {
  title: string;
  content: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MeetingMind: React.FC<MeetingMindProps> = ({
  title = '',
  content = '',
  className = 'meeting-mind-container',
  titleClassName = 'meeting-mind-title',
  contentClassName = 'meeting-mind-content',
}) => {
  // Memoize the rendered content to improve performance
  const renderedContent = useMemo(
    () => (
      <div className={className}>
        <h1 className={titleClassName} aria-label={title}>
          {title}
        </h1>
        <p className={contentClassName} aria-label={content}>
          {content}
        </p>
      </div>
    ),
    [className, titleClassName, contentClassName, title, content]
  );

  return renderedContent;
};

// Wrap the component with React.memo to memoize the component and improve performance
export default memo(MeetingMind);

import React, { memo, useMemo } from 'react';

interface MeetingMindProps {
  title: string;
  content: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MeetingMind: React.FC<MeetingMindProps> = ({
  title = '',
  content = '',
  className = 'meeting-mind-container',
  titleClassName = 'meeting-mind-title',
  contentClassName = 'meeting-mind-content',
}) => {
  // Memoize the rendered content to improve performance
  const renderedContent = useMemo(
    () => (
      <div className={className}>
        <h1 className={titleClassName} aria-label={title}>
          {title}
        </h1>
        <p className={contentClassName} aria-label={content}>
          {content}
        </p>
      </div>
    ),
    [className, titleClassName, contentClassName, title, content]
  );

  return renderedContent;
};

// Wrap the component with React.memo to memoize the component and improve performance
export default memo(MeetingMind);