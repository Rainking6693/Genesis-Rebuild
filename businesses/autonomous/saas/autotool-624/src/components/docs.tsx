// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileReader'; // Assuming a file reader utility
import { SearchBar } from './SearchBar'; // Assuming a search bar component
import { TableOfContents } from './TableOfContents'; // Assuming a table of contents component

interface DocsProps {
  filePath: string; // Path to the documentation file
}

export const Docs: React.FC<DocsProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoading(true);
        const fileContent = await Read(filePath); // Use the Read tool
        setContent(fileContent);
        setLoading(false);
      } catch (err: any) {
        console.error("Error loading documentation:", err);
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    loadDocs();
  }, [filePath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <SearchBar content={content} />
      <TableOfContents content={content} />
      <div className="docs-content">
        {content}
      </div>
    </div>
  );
};

// Basic error boundary component (can be improved)
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, errorInfo: any) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return children;
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileReader'; // Assuming a file reader utility
import { SearchBar } from './SearchBar'; // Assuming a search bar component
import { TableOfContents } from './TableOfContents'; // Assuming a table of contents component

interface DocsProps {
  filePath: string; // Path to the documentation file
}

export const Docs: React.FC<DocsProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoading(true);
        const fileContent = await Read(filePath); // Use the Read tool
        setContent(fileContent);
        setLoading(false);
      } catch (err: any) {
        console.error("Error loading documentation:", err);
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    loadDocs();
  }, [filePath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <SearchBar content={content} />
      <TableOfContents content={content} />
      <div className="docs-content">
        {content}
      </div>
    </div>
  );
};

// Basic error boundary component (can be improved)
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, errorInfo: any) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return children;
};

export default Docs;