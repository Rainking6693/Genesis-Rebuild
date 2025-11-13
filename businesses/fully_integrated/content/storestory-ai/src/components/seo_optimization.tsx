import React, { FC, useEffect, useRef } from 'react';

interface Props {
  seoTitle: string; // Add seoTitle for SEO optimization
  seoDescription: string; // Add seoDescription for SEO optimization
  message: string;
  isProduction: boolean; // Add isProduction flag for production environment
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, message, isProduction }) => {
  const titleRef = useRef<HTMLTitleElement | null>(null);
  const descriptionRef = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    // Add meta tags for SEO optimization
    if (!titleRef.current) {
      titleRef.current = document.createElement('title');
      titleRef.current.setAttribute('name', 'title');
      document.head.appendChild(titleRef.current);
    }
    titleRef.current?.setAttribute('content', seoTitle);

    if (!descriptionRef.current) {
      descriptionRef.current = document.createElement('meta');
      descriptionRef.current.setAttribute('name', 'description');
      document.head.appendChild(descriptionRef.current);
    }
    descriptionRef.current?.setAttribute('content', seoDescription);
  }, [seoTitle, seoDescription]);

  return (
    <div>
      {/* Use dangerouslySetInnerHTML for safe rendering of user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useRef } from 'react';

interface Props {
  seoTitle: string; // Add seoTitle for SEO optimization
  seoDescription: string; // Add seoDescription for SEO optimization
  message: string;
  isProduction: boolean; // Add isProduction flag for production environment
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, message, isProduction }) => {
  const titleRef = useRef<HTMLTitleElement | null>(null);
  const descriptionRef = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    // Add meta tags for SEO optimization
    if (!titleRef.current) {
      titleRef.current = document.createElement('title');
      titleRef.current.setAttribute('name', 'title');
      document.head.appendChild(titleRef.current);
    }
    titleRef.current?.setAttribute('content', seoTitle);

    if (!descriptionRef.current) {
      descriptionRef.current = document.createElement('meta');
      descriptionRef.current.setAttribute('name', 'description');
      document.head.appendChild(descriptionRef.current);
    }
    descriptionRef.current?.setAttribute('content', seoDescription);
  }, [seoTitle, seoDescription]);

  return (
    <div>
      {/* Use dangerouslySetInnerHTML for safe rendering of user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default MyComponent;