import React, { useEffect, useState } from 'react';
import { sanitizeUserInput, defaultSEOTitle, defaultSEODescription } from 'security-utils';
import useSEO from 'seo-utils';

interface Props {
  message: string;
}

interface SEO {
  title: string;
  description: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [htmlMessage, setHtmlMessage] = useState<string | null>(null);
  const [seoData, setSEOData] = useState<SEO>({ title: defaultSEOTitle, description: defaultSEODescription });

  useEffect(() => {
    const sanitizedMessage = sanitizeUserInput(message);
    setHtmlMessage(sanitizedMessage || defaultSEOTitle);

    const { title, description } = useSEO(message || defaultSEOTitle);
    setSEOData({ title, description });
  }, [message]);

  if (!htmlMessage) return null;

  return (
    <>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
    </>
  );
};

export default MyComponent;

1. Added a state variable `seoData` to store the SEO data.
2. Updated the useEffect hook to set both `htmlMessage` and `seoData` whenever the `message` prop changes.
3. Updated the SEO title and description in the useEffect hook to use the default SEO values if the user input is empty.
4. Moved the SEO logic into the useEffect hook to separate it from the main component.
5. Updated the title and description meta tags to use the `seoData` state.
6. Improved accessibility by setting the title and description meta tags.
7. Made the component more maintainable by separating the SEO logic from the main component and using a separate `SEO` interface.