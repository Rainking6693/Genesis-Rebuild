import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoScoreAnalytics } from '../../../business_context';

interface Props extends DefaultProps {
  title: string;
  subtitle: string;
  content: string;
}

interface DefaultProps {
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({
  title,
  subtitle,
  content,
  className,
  ariaLabel,
  ...rest
}) => {
  const sanitizedContent = React.useMemo(
    () => (content.trim() ? { __html: content.replace(/<[^>]+>/g, '') } : null),
    [content]
  );

  const titleId = `title-${Math.random().toString(36).substr(2, 9)}`;
  const subtitleId = `subtitle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className} {...rest} aria-labelledby={`${titleId} ${subtitleId}`}>
      <h1 id={titleId} aria-level={1}>
        {title}
      </h1>
      <h2 id={subtitleId} aria-level={2}>
        {subtitle}
      </h2>
      {sanitizedContent && <div dangerouslySetInnerHTML={sanitizedContent} />}
      <footer>
        Powered by <a href={EcoScoreAnalytics.website}>{EcoScoreAnalytics.name}</a>
      </footer>
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: 'Blog post',
};

export default MyComponent;

import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoScoreAnalytics } from '../../../business_context';

interface Props extends DefaultProps {
  title: string;
  subtitle: string;
  content: string;
}

interface DefaultProps {
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({
  title,
  subtitle,
  content,
  className,
  ariaLabel,
  ...rest
}) => {
  const sanitizedContent = React.useMemo(
    () => (content.trim() ? { __html: content.replace(/<[^>]+>/g, '') } : null),
    [content]
  );

  const titleId = `title-${Math.random().toString(36).substr(2, 9)}`;
  const subtitleId = `subtitle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className} {...rest} aria-labelledby={`${titleId} ${subtitleId}`}>
      <h1 id={titleId} aria-level={1}>
        {title}
      </h1>
      <h2 id={subtitleId} aria-level={2}>
        {subtitle}
      </h2>
      {sanitizedContent && <div dangerouslySetInnerHTML={sanitizedContent} />}
      <footer>
        Powered by <a href={EcoScoreAnalytics.website}>{EcoScoreAnalytics.name}</a>
      </footer>
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: 'Blog post',
};

export default MyComponent;