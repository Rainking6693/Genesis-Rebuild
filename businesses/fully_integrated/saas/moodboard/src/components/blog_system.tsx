import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

import { Props as BlogComponentProps } from './BlogComponent';

const MoodBoardBlogComponent: React.FC<Omit<BlogComponentProps, 'message'>> = ({ title = '', subtitle = '', content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useMemo(() => {
    if (!content) return setSanitizedContent('');
    setSanitizedContent(DOMPurify.sanitize(content));
  }, [content]);

  return (
    <div>
      <h1 aria-level={1} aria-label={`Title: ${title}`}>{title}</h1>
      <h2 aria-level={2} aria-label={`Subtitle: ${subtitle}`}>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

interface Props {
  title: string;
  subtitle: string;
  content?: string;
}

export default MoodBoardBlogComponent;

// Adding a default value for the sanitizedContent state in case content is undefined or null
MoodBoardBlogComponent.defaultProps = {
  sanitizedContent: '',
};

import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

import { Props as BlogComponentProps } from './BlogComponent';

const MoodBoardBlogComponent: React.FC<Omit<BlogComponentProps, 'message'>> = ({ title = '', subtitle = '', content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useMemo(() => {
    if (!content) return setSanitizedContent('');
    setSanitizedContent(DOMPurify.sanitize(content));
  }, [content]);

  return (
    <div>
      <h1 aria-level={1} aria-label={`Title: ${title}`}>{title}</h1>
      <h2 aria-level={2} aria-label={`Subtitle: ${subtitle}`}>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

interface Props {
  title: string;
  subtitle: string;
  content?: string;
}

export default MoodBoardBlogComponent;

// Adding a default value for the sanitizedContent state in case content is undefined or null
MoodBoardBlogComponent.defaultProps = {
  sanitizedContent: '',
};