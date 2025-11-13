import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageType?: string; // e.g., 'image/jpeg', 'image/png'
  ogImageWidth?: number;
  ogImageHeight?: number;
  robots?: string;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  title = "ReviewFlow Counter",
  description = "A simple counter component for ReviewFlow.",
  keywords = "ReviewFlow, counter, component",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageType,
  ogImageWidth,
  ogImageHeight,
  robots,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
}) => {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + incrementBy);
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => prevCount - incrementBy);
  }, [incrementBy]);

  useEffect(() => {
    console.log(`Counter updated: ${count}`);
  }, [count]);

  const sanitizeString = useCallback((str: string | undefined, maxLength: number): string => {
    if (!str) {
      return '';
    }

    const sanitized = str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const truncated = sanitized.length > maxLength ? sanitized.substring(0, maxLength).trim() + '...' : sanitized;

    return truncated;
  }, []);

  const isValidUrl = useCallback((url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error("Invalid URL:", url);
      return false;
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{sanitizeString(title, 60)}</title>
        <meta name="description" content={sanitizeString(description, 160)} />
        <meta name="keywords" content={sanitizeString(keywords, 255)} />

        {canonicalUrl && isValidUrl(canonicalUrl) && <link rel="canonical" href={canonicalUrl} />}

        {ogTitle && <meta property="og:title" content={sanitizeString(ogTitle, 60)} />}
        {ogDescription && <meta property="og:description" content={sanitizeString(ogDescription, 160)} />}
        {ogImage && isValidUrl(ogImage) && <meta property="og:image" content={ogImage} />}
        {ogImage && isValidUrl(ogImage) && ogImageType && <meta property="og:image:type" content={ogImageType} />}
        {ogImage && isValidUrl(ogImage) && ogImageWidth && <meta property="og:image:width" content={ogImageWidth} />}
        {ogImage && isValidUrl(ogImage) && ogImageHeight && <meta property="og:image:height" content={ogImageHeight} />}
        {ogImage && isValidUrl(ogImage) && <meta property="og:image:alt" content={sanitizeString(description, 160)} />}

        {robots && <meta name="robots" content={robots} />}
        <meta property="og:type" content="website" />
      </Helmet>
      <div>
        <p>Count: {count}</p>
        <button onClick={increment} aria-label={ariaLabelIncrement}>Increment</button>
        <button onClick={decrement} aria-label={ariaLabelDecrement}>Decrement</button>
      </div>
    </>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageType?: string; // e.g., 'image/jpeg', 'image/png'
  ogImageWidth?: number;
  ogImageHeight?: number;
  robots?: string;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  title = "ReviewFlow Counter",
  description = "A simple counter component for ReviewFlow.",
  keywords = "ReviewFlow, counter, component",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageType,
  ogImageWidth,
  ogImageHeight,
  robots,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
}) => {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + incrementBy);
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => prevCount - incrementBy);
  }, [incrementBy]);

  useEffect(() => {
    console.log(`Counter updated: ${count}`);
  }, [count]);

  const sanitizeString = useCallback((str: string | undefined, maxLength: number): string => {
    if (!str) {
      return '';
    }

    const sanitized = str.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const truncated = sanitized.length > maxLength ? sanitized.substring(0, maxLength).trim() + '...' : sanitized;

    return truncated;
  }, []);

  const isValidUrl = useCallback((url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error("Invalid URL:", url);
      return false;
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{sanitizeString(title, 60)}</title>
        <meta name="description" content={sanitizeString(description, 160)} />
        <meta name="keywords" content={sanitizeString(keywords, 255)} />

        {canonicalUrl && isValidUrl(canonicalUrl) && <link rel="canonical" href={canonicalUrl} />}

        {ogTitle && <meta property="og:title" content={sanitizeString(ogTitle, 60)} />}
        {ogDescription && <meta property="og:description" content={sanitizeString(ogDescription, 160)} />}
        {ogImage && isValidUrl(ogImage) && <meta property="og:image" content={ogImage} />}
        {ogImage && isValidUrl(ogImage) && ogImageType && <meta property="og:image:type" content={ogImageType} />}
        {ogImage && isValidUrl(ogImage) && ogImageWidth && <meta property="og:image:width" content={ogImageWidth} />}
        {ogImage && isValidUrl(ogImage) && ogImageHeight && <meta property="og:image:height" content={ogImageHeight} />}
        {ogImage && isValidUrl(ogImage) && <meta property="og:image:alt" content={sanitizeString(description, 160)} />}

        {robots && <meta name="robots" content={robots} />}
        <meta property="og:type" content="website" />
      </Helmet>
      <div>
        <p>Count: {count}</p>
        <button onClick={increment} aria-label={ariaLabelIncrement}>Increment</button>
        <button onClick={decrement} aria-label={ariaLabelDecrement}>Decrement</button>
      </div>
    </>
  );
};

export default Counter;