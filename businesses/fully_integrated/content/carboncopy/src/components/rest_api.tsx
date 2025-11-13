import React from 'react';
import DOMPurify, { sanitize } from 'dompurify';

interface CarbonCopyReportProps {
  title: string;
  content: string;
  shareUrl?: string;
}

const CarbonCopyReport: React.FC<CarbonCopyReportProps> = ({ title, content, shareUrl }) => {
  // Check for XSS vulnerabilities by sanitizing the input using DOMPurify
  const sanitizedTitle = sanitize(title, { ALLOWED_TAGS: [] });
  const sanitizedContent = sanitize(content, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'] });

  return (
    <div className="carbon-copy-report">
      <h1 className="carbon-copy-report__title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <div
        className="carbon-copy-report__content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
      />
      {shareUrl && (
        <div className="carbon-copy-report__share">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="carbon-copy-report__share-link"
            aria-label="Share Report"
          >
            Share Report
          </a>
        </div>
      )}
    </div>
  );
};

export default CarbonCopyReport;

import React from 'react';
import DOMPurify, { sanitize } from 'dompurify';

interface CarbonCopyReportProps {
  title: string;
  content: string;
  shareUrl?: string;
}

const CarbonCopyReport: React.FC<CarbonCopyReportProps> = ({ title, content, shareUrl }) => {
  // Check for XSS vulnerabilities by sanitizing the input using DOMPurify
  const sanitizedTitle = sanitize(title, { ALLOWED_TAGS: [] });
  const sanitizedContent = sanitize(content, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'] });

  return (
    <div className="carbon-copy-report">
      <h1 className="carbon-copy-report__title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <div
        className="carbon-copy-report__content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
      />
      {shareUrl && (
        <div className="carbon-copy-report__share">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="carbon-copy-report__share-link"
            aria-label="Share Report"
          >
            Share Report
          </a>
        </div>
      )}
    </div>
  );
};

export default CarbonCopyReport;