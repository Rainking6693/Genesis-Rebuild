import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  previewText: string;
  body: string;
  altText?: string; // Add altText for accessibility
  imageUrl?: string; // Add imageUrl for better handling of image sources
}

const MyEmailComponent: FC<Props> = ({ subject, previewText, body, altText, imageUrl }) => {
  const sanitizedBody = body.replace(/<[^>]+>/g, ''); // Remove HTML tags for resiliency and edge cases

  // Check if the sanitized body is empty before rendering it
  const renderedBody = sanitizedBody ? <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} /> : null;

  // Handle the case when altText is provided but imageUrl is not
  if (altText && !imageUrl) {
    throw new Error('Image URL is required when altText is provided.');
  }

  // Handle the case when imageUrl is provided but altText is not
  if (!altText && imageUrl) {
    altText = 'Image'; // Set a default alt text if none is provided
  }

  return (
    <div>
      <h2>{subject}</h2>
      <p>{previewText}</p>
      {renderedBody}
      {altText && <img src={imageUrl || `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(atob(altText))))}`} alt={altText} />}
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  previewText: string;
  body: string;
  altText?: string; // Add altText for accessibility
  imageUrl?: string; // Add imageUrl for better handling of image sources
}

const MyEmailComponent: FC<Props> = ({ subject, previewText, body, altText, imageUrl }) => {
  const sanitizedBody = body.replace(/<[^>]+>/g, ''); // Remove HTML tags for resiliency and edge cases

  // Check if the sanitized body is empty before rendering it
  const renderedBody = sanitizedBody ? <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} /> : null;

  // Handle the case when altText is provided but imageUrl is not
  if (altText && !imageUrl) {
    throw new Error('Image URL is required when altText is provided.');
  }

  // Handle the case when imageUrl is provided but altText is not
  if (!altText && imageUrl) {
    altText = 'Image'; // Set a default alt text if none is provided
  }

  return (
    <div>
      <h2>{subject}</h2>
      <p>{previewText}</p>
      {renderedBody}
      {altText && <img src={imageUrl || `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(atob(altText))))}`} alt={altText} />}
    </div>
  );
};

export default MyEmailComponent;