// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocsProps {
  contentUrl: string;
}

interface DocsContent {
  title: string;
  body: string;
}

const Docs: React.FC<DocsProps> = ({ contentUrl }) => {
  const [content, setContent] = useState<DocsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DocsContent = await response.json();
        setContent(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  if (!content) {
    return <div>No documentation found.</div>;
  }

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.body}</p>
    </div>
  );
};

export default Docs;