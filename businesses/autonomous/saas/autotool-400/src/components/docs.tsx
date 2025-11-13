// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown for rendering
import { useRouter } from 'next/router'; // Assuming Next.js for routing

interface DocMetadata {
  title: string;
  path: string;
}

const Docs = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { doc } = router.query; // Get the doc parameter from the URL

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        if (!doc) {
          setContent("# Welcome to the Documentation\n\nPlease select a document from the sidebar.");
          return;
        }

        const filePath = `/docs/${doc}.md`; // Assuming docs are stored as markdown files

        try {
          const response = await fetch(filePath);

          if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
          }

          const text = await response.text();
          setContent(text);
          setError(null);
        } catch (fetchError: any) {
          console.error("Error fetching doc:", fetchError);
          setError(`Failed to load document. Please check the console for details. ${fetchError.message}`);
          setContent("# Error Loading Documentation\n\nAn error occurred while loading the requested document. Please try again later.");
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        setError(`An unexpected error occurred. Please check the console for details. ${error.message}`);
        setContent("# Error Loading Documentation\n\nAn unexpected error occurred while loading the requested document. Please try again later.");
      }
    };

    fetchDoc();
  }, [doc]);

  return (
    <div className="docs-container">
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown for rendering
import { useRouter } from 'next/router'; // Assuming Next.js for routing

interface DocMetadata {
  title: string;
  path: string;
}

const Docs = () => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { doc } = router.query; // Get the doc parameter from the URL

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        if (!doc) {
          setContent("# Welcome to the Documentation\n\nPlease select a document from the sidebar.");
          return;
        }

        const filePath = `/docs/${doc}.md`; // Assuming docs are stored as markdown files

        try {
          const response = await fetch(filePath);

          if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
          }

          const text = await response.text();
          setContent(text);
          setError(null);
        } catch (fetchError: any) {
          console.error("Error fetching doc:", fetchError);
          setError(`Failed to load document. Please check the console for details. ${fetchError.message}`);
          setContent("# Error Loading Documentation\n\nAn error occurred while loading the requested document. Please try again later.");
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        setError(`An unexpected error occurred. Please check the console for details. ${error.message}`);
        setContent("# Error Loading Documentation\n\nAn unexpected error occurred while loading the requested document. Please try again later.");
      }
    };

    fetchDoc();
  }, [doc]);

  return (
    <div className="docs-container">
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default Docs;