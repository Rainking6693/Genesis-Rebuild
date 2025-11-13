import React, { PropsWithChildren, Ref, forwardRef } from 'react';
import { EcoScoreAnalytics } from '../../../business_context';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

interface DefaultProps {
  children?: React.ReactNode;
}

type CombinedProps = Props & DefaultProps;

const MyComponent = forwardRef<HTMLDivElement, CombinedProps>(({ title, subtitle, content, children }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const footerLinkUrl = useMemo(() => EcoScoreAnalytics?.url || '', [EcoScoreAnalytics]);

  return (
    <div ref={ref} data-testid="my-component">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
      <footer>
        Powered by <a href={footerLinkUrl} aria-label="EcoScoreAnalytics" onClick={handleClick}>{EcoScoreAnalytics?.name || ''}</a>
      </footer>
    </div>
  );
});

MyComponent.defaultProps = {
  children: null,
};

export default MyComponent;

import React, { PropsWithChildren, Ref, forwardRef } from 'react';
import { EcoScoreAnalytics } from '../../../business_context';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

interface DefaultProps {
  children?: React.ReactNode;
}

type CombinedProps = Props & DefaultProps;

const MyComponent = forwardRef<HTMLDivElement, CombinedProps>(({ title, subtitle, content, children }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const footerLinkUrl = useMemo(() => EcoScoreAnalytics?.url || '', [EcoScoreAnalytics]);

  return (
    <div ref={ref} data-testid="my-component">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {children}
      <footer>
        Powered by <a href={footerLinkUrl} aria-label="EcoScoreAnalytics" onClick={handleClick}>{EcoScoreAnalytics?.name || ''}</a>
      </footer>
    </div>
  );
});

MyComponent.defaultProps = {
  children: null,
};

export default MyComponent;