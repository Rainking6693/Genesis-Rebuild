import React, { FC, useEffect, useState } from 'react';
import { EcoFlowTrackerBranding } from '../../branding';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

const MyComponent: FC<Props> = ({ title, subtitle, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const sanitized = MyComponent.sanitizeContent(content);
    setSanitizedContent(sanitized);
  }, [content]);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('aria-label', 'Main header');
    }

    const footer = document.querySelector('footer');
    if (footer) {
      footer.setAttribute('aria-label', 'Main footer');
    }
  }, []);

  return (
    <div>
      {/* Include branding for consistent header */}
      <EcoFlowTrackerBranding.Header />
      <header role="banner">
        <h1>{title}</h1>
      </header>
      {/* Include branding for consistent footer */}
      <footer role="contentinfo">
        <EcoFlowTrackerBranding.Footer />
      </footer>
      <h2 id="subtitle">{subtitle}</h2>
      <div id="content" dangerouslySetInnerHTML={sanitizedContent} />
    </div>
  );
};

MyComponent.sanitizeContent = (content: string) => {
  return { __html: DOMPurify.sanitize(content) };
};

export default memo(MyComponent);

import React, { FC, useEffect, useState } from 'react';
import { EcoFlowTrackerBranding } from '../../branding';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

const MyComponent: FC<Props> = ({ title, subtitle, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    const sanitized = MyComponent.sanitizeContent(content);
    setSanitizedContent(sanitized);
  }, [content]);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('aria-label', 'Main header');
    }

    const footer = document.querySelector('footer');
    if (footer) {
      footer.setAttribute('aria-label', 'Main footer');
    }
  }, []);

  return (
    <div>
      {/* Include branding for consistent header */}
      <EcoFlowTrackerBranding.Header />
      <header role="banner">
        <h1>{title}</h1>
      </header>
      {/* Include branding for consistent footer */}
      <footer role="contentinfo">
        <EcoFlowTrackerBranding.Footer />
      </footer>
      <h2 id="subtitle">{subtitle}</h2>
      <div id="content" dangerouslySetInnerHTML={sanitizedContent} />
    </div>
  );
};

MyComponent.sanitizeContent = (content: string) => {
  return { __html: DOMPurify.sanitize(content) };
};

export default memo(MyComponent);