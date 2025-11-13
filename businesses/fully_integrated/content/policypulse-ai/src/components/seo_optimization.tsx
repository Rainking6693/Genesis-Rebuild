import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add relevant keywords for SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const [id, setId] = useState<string>('');
  const idRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a unique ID if one doesn't exist yet
    if (!id) {
      setId(`policypulse-ai-compliance-checklist-${Math.random().toString(36).substring(7)}`);
    }
  }, []);

  useEffect(() => {
    // Set the ID of the component if it hasn't been set yet
    if (!idRef.current) {
      idRef.current.id = id;
    }
  }, [id]);

  // Check if the ID is already in use before setting it
  useEffect(() => {
    if (!idRef.current || idRef.current.id === id) return;
    const existingId = idRef.current.id;
    setId(`policypulse-ai-compliance-checklist-${Math.random().toString(36).substring(7)}`);
    idRef.current.id = id;
    console.warn(`ID "${existingId}" is already in use. Using a new ID: "${id}"`);
  }, [idRef.current]);

  return (
    <div id={id} ref={idRef}>
      {/* Add an SEO-friendly heading */}
      <h2>{title}</h2>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {message}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add relevant keywords for SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const [id, setId] = useState<string>('');
  const idRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a unique ID if one doesn't exist yet
    if (!id) {
      setId(`policypulse-ai-compliance-checklist-${Math.random().toString(36).substring(7)}`);
    }
  }, []);

  useEffect(() => {
    // Set the ID of the component if it hasn't been set yet
    if (!idRef.current) {
      idRef.current.id = id;
    }
  }, [id]);

  // Check if the ID is already in use before setting it
  useEffect(() => {
    if (!idRef.current || idRef.current.id === id) return;
    const existingId = idRef.current.id;
    setId(`policypulse-ai-compliance-checklist-${Math.random().toString(36).substring(7)}`);
    idRef.current.id = id;
    console.warn(`ID "${existingId}" is already in use. Using a new ID: "${id}"`);
  }, [idRef.current]);

  return (
    <div id={id} ref={idRef}>
      {/* Add an SEO-friendly heading */}
      <h2>{title}</h2>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {message}
    </div>
  );
};

export default MyComponent;