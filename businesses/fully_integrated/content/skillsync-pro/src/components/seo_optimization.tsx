import React, { useEffect } from 'react';
import { SEO_META_TAGS } from '../../constants/seo';

interface Props {
  title: string;
  description: string;
  message?: string; // Added optional message prop for flexibility
}

const MyComponent: React.FC<Props> = ({ title, description, message }) => {
  const [url, setUrl] = React.useState(window.location.pathname);

  useEffect(() => {
    setUrl(window.location.pathname);
  }, [window.location.pathname]);

  const defaultTitle = SEO_META_TAGS.title || 'Default Title'; // Provide a default title in case SEO_META_TAGS.title is undefined
  const defaultDescription = description || 'Default Description'; // Provide a default description in case description is undefined

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{defaultTitle}</title> // Use defaultTitle instead of SEO_META_TAGS.title to ensure a title is always present
      <meta name="description" content={defaultDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:url" content={`https://www.skillsyncpro.com/${url}`} /> // Use url state for dynamic URL generation
      <meta property="og:image" content={`https://www.skillsyncpro.com/og-image.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={`https://www.skillsyncpro.com/og-image.jpg`} />
      <link rel="canonical" href={`https://www.skillsyncpro.com/${url}`} />
      <link rel="icon" type="image/png" href={`https://www.skillsyncpro.com/favicon.ico`} />
      {message && <p>{message}</p>} // Render message as a regular paragraph for better accessibility
    </>
  );
};

export default MyComponent;

This version uses `React.useEffect` to dynamically update the URL based on the current page, and it renders the message as a regular paragraph instead of using `dangerouslySetInnerHTML`. This approach is safer and more accessible.