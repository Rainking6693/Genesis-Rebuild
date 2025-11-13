// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer'; // Assuming a component to render Markdown
import { SearchBar } from './SearchBar'; // Assuming a component for search
import { TableOfContents } from './TableOfContents'; // Assuming a component for table of contents

interface DocumentationProps {
  contentUrl: string; // URL to fetch the documentation content from
}

export const Documentation: React.FC<DocumentationProps> = ({ contentUrl }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="documentation-container">
      <SearchBar />
      <TableOfContents content={content} />
      <MarkdownRenderer content={content} />
    </div>
  );
};

// Example MarkdownRenderer component (placeholder)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // In a real application, this would use a library like 'react-markdown'
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

// Example SearchBar component (placeholder)
const SearchBar: React.FC = () => {
  return <input type="text" placeholder="Search documentation..." />;
};

// Example TableOfContents component (placeholder)
const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  // This would parse the content and generate a table of contents
  return <div>Table of Contents</div>;
};

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer'; // Assuming a component to render Markdown
import { SearchBar } from './SearchBar'; // Assuming a component for search
import { TableOfContents } from './TableOfContents'; // Assuming a component for table of contents

interface DocumentationProps {
  contentUrl: string; // URL to fetch the documentation content from
}

export const Documentation: React.FC<DocumentationProps> = ({ contentUrl }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error("Error fetching documentation:", e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="documentation-container">
      <SearchBar />
      <TableOfContents content={content} />
      <MarkdownRenderer content={content} />
    </div>
  );
};

// Example MarkdownRenderer component (placeholder)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // In a real application, this would use a library like 'react-markdown'
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

// Example SearchBar component (placeholder)
const SearchBar: React.FC = () => {
  return <input type="text" placeholder="Search documentation..." />;
};

// Example TableOfContents component (placeholder)
const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  // This would parse the content and generate a table of contents
  return <div>Table of Contents</div>;
};