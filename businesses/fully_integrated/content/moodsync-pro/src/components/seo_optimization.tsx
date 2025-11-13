import React, { FC, useEffect } from 'react';
import { useSeo } from './useSeo';
import { sanitize } from 'isomorphic-dompurify';

interface Props {
  seoTitle: string; // Add SEO title for better SEO optimization
  seoDescription: string; // Add SEO description for better SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, message }) => {
  const { setTitle, setDescription } = useSeo();

  useEffect(() => {
    setTitle(seoTitle);
    setDescription(seoDescription);
  }, [seoTitle, seoDescription]);

  const sanitizedMessage = sanitize(message); // Sanitize user-generated content to prevent XSS attacks

  return (
    <div>
      {/* Add Open Graph tags for better social media sharing */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />

      {/* Use React.Fragment for better performance */}
      <React.Fragment>
        <h1>{seoTitle}</h1>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </React.Fragment>
    </div>
  );
};

export default MyComponent;

// useSeo.ts
import { useEffect, useState } from 'react';

export const useSeo = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const updateMetaTags = () => {
      document.title = title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.content = description;
      }
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1';
        document.head.appendChild(metaViewport);
      }
    };

    updateMetaTags();
    window.addEventListener('update-meta-tags', updateMetaTags);

    return () => {
      window.removeEventListener('update-meta-tags', updateMetaTags);
    };
  }, [title, description]);

  return { setTitle, setDescription };
};

// Import isomorphic-dompurify for sanitizing user-generated content
// You can install it using npm: npm install isomorphic-dompurify

In this updated code, I've added the `isomorphic-dompurify` library for sanitizing user-generated content to prevent XSS attacks. I've also added a default viewport meta tag to ensure better mobile compatibility. Additionally, I've used the `useState` hook instead of `useState` for better TypeScript support.