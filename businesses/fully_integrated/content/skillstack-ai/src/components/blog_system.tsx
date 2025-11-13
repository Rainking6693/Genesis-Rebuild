import React, { useState } from 'react';
import { HeadFC } from './Head';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  description: string;
  keywords: string[];
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ title, description, keywords, message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  // Sanitize user-generated content
  const sanitize = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  // Sanitize the message on mount and when it changes
  React.useEffect(() => {
    setSanitizedMessage(sanitize(message));
  }, [message]);

  return (
    <div>
      {/* Use HeadFC for SEO meta tags */}
      <Head title={title} description={description} keywords={keywords} />

      {/* Use a safe DOM property for user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default FunctionalComponent;

import React, { useState } from 'react';
import { HeadFC } from './Head';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  description: string;
  keywords: string[];
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ title, description, keywords, message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  // Sanitize user-generated content
  const sanitize = (html: string) => {
    return DOMPurify.sanitize(html);
  };

  // Sanitize the message on mount and when it changes
  React.useEffect(() => {
    setSanitizedMessage(sanitize(message));
  }, [message]);

  return (
    <div>
      {/* Use HeadFC for SEO meta tags */}
      <Head title={title} description={description} keywords={keywords} />

      {/* Use a safe DOM property for user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default FunctionalComponent;