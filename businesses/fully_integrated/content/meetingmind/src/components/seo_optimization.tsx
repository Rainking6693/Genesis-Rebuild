import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string; // Add ogType for more flexibility
  twitterCard?: string; // Add twitterCard type
  twitterHandle?: string; // Optional Twitter handle
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  title = "MeetingMind Counter",
  description = "A simple counter component for MeetingMind.",
  keywords = "MeetingMind, counter, component",
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterHandle,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const isMounted = useRef(false); // Ref to track component mount

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
        setError("Invalid increment value. Must be a finite number.");
        console.error("Invalid increment value:", incrementBy);
        return prevCount; // Don't change the count
      }

      if (prevCount > Number.MAX_SAFE_INTEGER - incrementBy) {
        console.warn("Maximum count reached. Increment ignored to prevent overflow.");
        setError("Maximum count reached.");
        return prevCount;
      }
      setError(null); // Clear any previous error
      return prevCount + incrementBy;
    });
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
        setError("Invalid decrement value. Must be a finite number.");
        console.error("Invalid decrement value:", incrementBy);
        return prevCount; // Don't change the count
      }

      if (prevCount < Number.MIN_SAFE_INTEGER + incrementBy) {
        console.warn("Minimum count reached. Decrement ignored to prevent underflow.");
        setError("Minimum count reached.");
        return prevCount;
      }
      setError(null); // Clear any previous error
      return prevCount - incrementBy;
    });
  }, [incrementBy]);

  // Dynamic document title update
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; // Skip on initial render (for server-side rendering safety)
    }

    try {
      const newTitle = `${title} - Count: ${count}`;
      document.title = newTitle;
    } catch (e) {
      console.error("Error setting document title:", e);
    }
  }, [count, title]);

  const seoTitle = `${title} - Count: ${count}`;

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          title: ogTitle || seoTitle,
          description: ogDescription || description,
          images: ogImage ? [{ url: ogImage }] : [],
          type: ogType,
          url: canonicalUrl,
        }}
        twitter={{
          handle: twitterHandle,
          cardType: twitterCard,
          site: twitterHandle, // Consider setting a default site if twitterHandle is not always provided
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          ...(robots ? [{ name: 'robots', content: robots }] : []), // Conditionally add robots meta tag
        ]}
      />

      <div>
        {error && (
          <div style={{ color: 'red' }} role="alert">
            {error}
          </div>
        )}
        <p aria-live="polite">Count: {count}</p>
        <button
          onClick={increment}
          aria-label="Increment counter"
          disabled={error !== null} // Disable button when there's an error
        >
          Increment
        </button>
        <button
          onClick={decrement}
          aria-label="Decrement counter"
          disabled={error !== null} // Disable button when there's an error
        >
          Decrement
        </button>
      </div>
    </>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string; // Add ogType for more flexibility
  twitterCard?: string; // Add twitterCard type
  twitterHandle?: string; // Optional Twitter handle
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  title = "MeetingMind Counter",
  description = "A simple counter component for MeetingMind.",
  keywords = "MeetingMind, counter, component",
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterHandle,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const isMounted = useRef(false); // Ref to track component mount

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
        setError("Invalid increment value. Must be a finite number.");
        console.error("Invalid increment value:", incrementBy);
        return prevCount; // Don't change the count
      }

      if (prevCount > Number.MAX_SAFE_INTEGER - incrementBy) {
        console.warn("Maximum count reached. Increment ignored to prevent overflow.");
        setError("Maximum count reached.");
        return prevCount;
      }
      setError(null); // Clear any previous error
      return prevCount + incrementBy;
    });
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
        setError("Invalid decrement value. Must be a finite number.");
        console.error("Invalid decrement value:", incrementBy);
        return prevCount; // Don't change the count
      }

      if (prevCount < Number.MIN_SAFE_INTEGER + incrementBy) {
        console.warn("Minimum count reached. Decrement ignored to prevent underflow.");
        setError("Minimum count reached.");
        return prevCount;
      }
      setError(null); // Clear any previous error
      return prevCount - incrementBy;
    });
  }, [incrementBy]);

  // Dynamic document title update
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; // Skip on initial render (for server-side rendering safety)
    }

    try {
      const newTitle = `${title} - Count: ${count}`;
      document.title = newTitle;
    } catch (e) {
      console.error("Error setting document title:", e);
    }
  }, [count, title]);

  const seoTitle = `${title} - Count: ${count}`;

  return (
    <>
      <NextSeo
        title={seoTitle}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          title: ogTitle || seoTitle,
          description: ogDescription || description,
          images: ogImage ? [{ url: ogImage }] : [],
          type: ogType,
          url: canonicalUrl,
        }}
        twitter={{
          handle: twitterHandle,
          cardType: twitterCard,
          site: twitterHandle, // Consider setting a default site if twitterHandle is not always provided
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          ...(robots ? [{ name: 'robots', content: robots }] : []), // Conditionally add robots meta tag
        ]}
      />

      <div>
        {error && (
          <div style={{ color: 'red' }} role="alert">
            {error}
          </div>
        )}
        <p aria-live="polite">Count: {count}</p>
        <button
          onClick={increment}
          aria-label="Increment counter"
          disabled={error !== null} // Disable button when there's an error
        >
          Increment
        </button>
        <button
          onClick={decrement}
          aria-label="Decrement counter"
          disabled={error !== null} // Disable button when there's an error
        >
          Decrement
        </button>
      </div>
    </>
  );
};

export default Counter;