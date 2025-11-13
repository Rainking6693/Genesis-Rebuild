import React, { FC, useEffect, useRef, useCallback } from 'react';

interface Props {
  message: string;
  trackUsage?: (usageData: any) => void;
}

const MyComponent: FC<Props> = ({ message, trackUsage }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleTrackUsage = useCallback(() => {
    if (divRef.current && trackUsage) {
      trackUsage({ component: 'MyComponent', message });
    }
  }, [message, trackUsage]);

  useEffect(handleTrackUsage, [handleTrackUsage]);

  return (
    <div ref={divRef} className="usage-analytics">
      <div
        className="usage-analytics-content"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

interface SanitizedHTML {
  __html: string;
}

const sanitizeHTML = (html: string): SanitizedHTML => ({
  __html: html
    .replace(/<[^>]*>/g, (tag) => tag.replace(/ /g, '')) // Remove spaces within tags
    .replace(/&/g, '&amp;') // Replace & with &amp;
    .replace(/</g, '&lt;') // Replace < with &lt;
    .replace(/>/g, '&gt;') // Replace > with &gt;
    .replace(/"/g, '&quot;') // Replace " with &quot;
    .replace(/'/g, '&apos;') // Replace ' with &apos;
});

export default MyComponent;

import React, { FC, useEffect, useRef, useCallback } from 'react';

interface Props {
  message: string;
  trackUsage?: (usageData: any) => void;
}

const MyComponent: FC<Props> = ({ message, trackUsage }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleTrackUsage = useCallback(() => {
    if (divRef.current && trackUsage) {
      trackUsage({ component: 'MyComponent', message });
    }
  }, [message, trackUsage]);

  useEffect(handleTrackUsage, [handleTrackUsage]);

  return (
    <div ref={divRef} className="usage-analytics">
      <div
        className="usage-analytics-content"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

interface SanitizedHTML {
  __html: string;
}

const sanitizeHTML = (html: string): SanitizedHTML => ({
  __html: html
    .replace(/<[^>]*>/g, (tag) => tag.replace(/ /g, '')) // Remove spaces within tags
    .replace(/&/g, '&amp;') // Replace & with &amp;
    .replace(/</g, '&lt;') // Replace < with &lt;
    .replace(/>/g, '&gt;') // Replace > with &gt;
    .replace(/"/g, '&quot;') // Replace " with &quot;
    .replace(/'/g, '&apos;') // Replace ' with &apos;
});

export default MyComponent;