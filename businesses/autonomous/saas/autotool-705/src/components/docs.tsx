// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Or another markdown renderer
import { useParams } from 'react-router-dom'; // If using routing

interface Doc {
  title: string;
  content: string;
}

const Docs = () => {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { docId } = useParams<{ docId: string }>(); // If using routing

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual data fetching logic (e.g., from a CMS or API)
        // This is a placeholder for fetching a specific document based on docId
        const response = await fetch(`/api/docs/${docId}.md`); // Example API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }
        const text = await response.text();

        //Basic Markdown parsing
        const title = text.split('\n')[0].replace('# ', '');
        const content = text.substring(text.indexOf('\n') + 1);

        setDoc({title: title, content: content});
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  if (!doc) {
    return <div>Document not found.</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <Markdown>{doc.content}</Markdown>
    </div>
  );
};

export default Docs;