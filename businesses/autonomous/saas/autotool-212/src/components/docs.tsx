// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown

interface DocsProps {
  source: string; // URL or path to the documentation content
}

const Docs: React.FC<DocsProps> = ({ source }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error}
      </div>
    );
  }

  return (
    <div className="docs-container">
      <Markdown>{content || ''}</Markdown>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown

interface DocsProps {
  source: string; // URL or path to the documentation content
}

const Docs: React.FC<DocsProps> = ({ source }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(source);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [source]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error}
      </div>
    );
  }

  return (
    <div className="docs-container">
      <Markdown>{content || ''}</Markdown>
    </div>
  );
};

export default Docs;

Now, I will generate the build report: