import React, { FC, useEffect } from 'react';

interface Props {
  title: string; // Add a title for better SEO
  description: string; // Add a description for better SEO
  keywords: string[]; // Add relevant keywords for better SEO
  message: string;
}

const createSEOTag = (name: string, content: string) => {
  const tag = document.createElement('meta');
  tag.name = name;
  tag.content = content;
  document.head.appendChild(tag);
};

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for each component for better accessibility and SEO
  const id = `carbon-compass-seo-optimized-component-${Math.random().toString(36).substring(7)}`;

  // Ensure the title, description, and keywords are provided
  if (!title || !description || !keywords.length) {
    console.error('Missing required props: title, description, and keywords');
    return null;
  }

  // Use a fallback title if the provided title is empty
  const fallbackTitle = 'Untitled SEO Optimized Component';
  const finalTitle = title ? title : fallbackTitle;

  // Use a fallback description if the provided description is empty
  const fallbackDescription = 'This is an SEO optimized component';
  const finalDescription = description ? description : fallbackDescription;

  // Use a fallback keywords array if the provided keywords are empty
  const fallbackKeywords = ['seo', 'optimization', 'react', 'component'];
  const finalKeywords = keywords.length ? keywords : fallbackKeywords;

  // Add an SEO meta tag for the title
  createSEOTag('title', finalTitle);

  // Add an SEO meta tag for the description
  createSEOTag('description', finalDescription);

  // Add an SEO meta tag for the keywords
  createSEOTag('keywords', finalKeywords.join(', '));

  // Wrap the content in an SEO-friendly H1 tag
  return (
    <div id={id} aria-labelledby={id}>
      <h1 id={id}>{message}</h1>
    </div>
  );
};

export default MyComponent;

In this version, I've added the `aria-labelledby` attribute to the `div` element to improve accessibility by providing a label for screen readers. Additionally, I've moved the creation of the SEO meta tags into a separate function to make the code more maintainable.