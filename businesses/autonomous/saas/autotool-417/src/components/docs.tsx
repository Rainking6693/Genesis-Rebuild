// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Or a similar markdown rendering library
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown

interface DocsProps {
  docId: string; // Identifier for the specific document to load
}

const Docs: React.FC<DocsProps> = ({ docId }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        // Replace with your actual data fetching logic (e.g., API call, reading from file)
        const response = await fetch(`/api/docs/${docId}`); // Example API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data = await response.text(); // Assuming the API returns markdown content
        setMarkdownContent(data);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching documentation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docId]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="docs-container">
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Or a similar markdown rendering library
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown

interface DocsProps {
  docId: string; // Identifier for the specific document to load
}

const Docs: React.FC<DocsProps> = ({ docId }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        // Replace with your actual data fetching logic (e.g., API call, reading from file)
        const response = await fetch(`/api/docs/${docId}`); // Example API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data = await response.text(); // Assuming the API returns markdown content
        setMarkdownContent(data);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching documentation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [docId]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error.message}
      </div>
    );
  }

  if (!markdownContent) {
    return <div>No documentation found.</div>;
  }

  return (
    <div className="docs-container">
      <Markdown remarkPlugins={[remarkGfm]}>{markdownContent}</Markdown>
    </div>
  );
};

export default Docs;

**Build Report:**