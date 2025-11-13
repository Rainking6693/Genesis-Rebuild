import React, { useEffect, useState } from 'react';
import { SEO_KEYWORDS, SEO_TITLE } from './seo-constants';
import { analyzeContent, updateSEOMetadata } from './seo-services';

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [seoTitle, setSeoTitle] = useState(SEO_TITLE);
  const [seoKeywords, setSeoKeywords] = useState(SEO_KEYWORDS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleContentAnalysis = async () => {
      try {
        const newTitle = await analyzeContent(name);
        if (newTitle) {
          setSeoTitle(newTitle);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    handleContentAnalysis();
  }, [name]);

  useEffect(() => {
    if (!isLoading && !error) {
      updateSEOMetadata({ title: seoTitle, keywords: seoKeywords.join(', ') });
    }
  }, [isLoading, error, seoTitle, seoKeywords]);

  if (error) {
    return (
      <div>
        <h1>An error occurred while analyzing the content: {error.message}</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <h1>Hello, {name}!</h1>
    </>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { SEO_KEYWORDS, SEO_TITLE } from './seo-constants';
import { analyzeContent, updateSEOMetadata } from './seo-services';

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [seoTitle, setSeoTitle] = useState(SEO_TITLE);
  const [seoKeywords, setSeoKeywords] = useState(SEO_KEYWORDS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleContentAnalysis = async () => {
      try {
        const newTitle = await analyzeContent(name);
        if (newTitle) {
          setSeoTitle(newTitle);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    handleContentAnalysis();
  }, [name]);

  useEffect(() => {
    if (!isLoading && !error) {
      updateSEOMetadata({ title: seoTitle, keywords: seoKeywords.join(', ') });
    }
  }, [isLoading, error, seoTitle, seoKeywords]);

  if (error) {
    return (
      <div>
        <h1>An error occurred while analyzing the content: {error.message}</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <h1>Hello, {name}!</h1>
    </>
  );
};

export default MyComponent;