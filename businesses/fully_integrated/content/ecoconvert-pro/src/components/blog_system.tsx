import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  callToActionText: string;
  callToActionUrl: string;
}

const BlogPost: React.FC<Props> = ({ title, content, seoTitle, seoDescription, callToActionText, callToActionUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    // Ensure initial state is false when component mounts
    setIsHovered(false);
  }, []);

  // Add error handling for invalid URLs
  const sanitizeUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch (error) {
      console.error(`Invalid URL provided: ${url}`);
      return '';
    }
  };

  const callToActionUrl = sanitizeUrl(callToActionUrl);

  return (
    <div>
      <SEO
        title={seoTitle}
        description={seoDescription}
      />
      <h1>{title}</h1>
      <p>{content}</p>
      <a
        href={callToActionUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Learn more about ${title}`} // Adding an accessible label for screen readers
        // Add rel="noopener noreferrer" to prevent issues with new windows/tabs
        rel="noopener noreferrer"
      >
        {callToActionText}
      </a>
      {isHovered && <CTA isHovered={true} />}
    </div>
  );
};

const CTA: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  return (
    <div className={`cta ${isHovered ? 'cta-hover' : ''}`}>
      {/* Add your CTA content here */}
    </div>
  );
};

const SEO = ({ title, description }) => {
  // Implement SEO meta tags
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" /> // Ensuring search engines can index and follow the page
      {/* Add other SEO meta tags as needed */}
    </>
  );
};

export default BlogPost;

import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  callToActionText: string;
  callToActionUrl: string;
}

const BlogPost: React.FC<Props> = ({ title, content, seoTitle, seoDescription, callToActionText, callToActionUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    // Ensure initial state is false when component mounts
    setIsHovered(false);
  }, []);

  // Add error handling for invalid URLs
  const sanitizeUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch (error) {
      console.error(`Invalid URL provided: ${url}`);
      return '';
    }
  };

  const callToActionUrl = sanitizeUrl(callToActionUrl);

  return (
    <div>
      <SEO
        title={seoTitle}
        description={seoDescription}
      />
      <h1>{title}</h1>
      <p>{content}</p>
      <a
        href={callToActionUrl}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Learn more about ${title}`} // Adding an accessible label for screen readers
        // Add rel="noopener noreferrer" to prevent issues with new windows/tabs
        rel="noopener noreferrer"
      >
        {callToActionText}
      </a>
      {isHovered && <CTA isHovered={true} />}
    </div>
  );
};

const CTA: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  return (
    <div className={`cta ${isHovered ? 'cta-hover' : ''}`}>
      {/* Add your CTA content here */}
    </div>
  );
};

const SEO = ({ title, description }) => {
  // Implement SEO meta tags
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" /> // Ensuring search engines can index and follow the page
      {/* Add other SEO meta tags as needed */}
    </>
  );
};

export default BlogPost;