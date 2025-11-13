// src/components/DocsComponent.tsx

import React, { useState, useEffect } from 'react';
import { Read } from '../utils/api'; // Assuming a utility for reading files/data
import SearchBar from './SearchBar'; // Assuming a search bar component
import ErrorBoundary from './ErrorBoundary'; // Assuming an error boundary component

interface DocsComponentProps {
  initialContentPath?: string; // Optional path to initial documentation content
}

const DocsComponent: React.FC<DocsComponentProps> = ({ initialContentPath = 'docs/index.md' }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadContent = async (path: string) => {
      try {
        const response = await Read({ file_path: path });
        if (response && typeof response === 'string') {
          setContent(response);
          setError(null);
        } else {
          setError(`Failed to load documentation content from ${path}. Response was: ${JSON.stringify(response)}`);
          setContent('');
        }
      } catch (e: any) {
        console.error("Error loading documentation:", e);
        setError(`Error loading documentation content from ${path}: ${e.message}`);
        setContent('');
      }
    };

    loadContent(initialContentPath);
  }, [initialContentPath]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic here (e.g., filter content)
    console.log(`Searching for: ${term}`); // Placeholder
  };

  const filteredContent = searchTerm
    ? content.toLowerCase().includes(searchTerm.toLowerCase())
      ? content
      : 'No results found for your search.'
    : content;

  return (
    <ErrorBoundary>
      <div>
        <h1>Documentation</h1>
        <SearchBar onSearch={handleSearch} />
        {error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: filteredContent }} /> // Assuming content is markdown/HTML
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DocsComponent;

// src/components/DocsComponent.tsx

import React, { useState, useEffect } from 'react';
import { Read } from '../utils/api'; // Assuming a utility for reading files/data
import SearchBar from './SearchBar'; // Assuming a search bar component
import ErrorBoundary from './ErrorBoundary'; // Assuming an error boundary component

interface DocsComponentProps {
  initialContentPath?: string; // Optional path to initial documentation content
}

const DocsComponent: React.FC<DocsComponentProps> = ({ initialContentPath = 'docs/index.md' }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadContent = async (path: string) => {
      try {
        const response = await Read({ file_path: path });
        if (response && typeof response === 'string') {
          setContent(response);
          setError(null);
        } else {
          setError(`Failed to load documentation content from ${path}. Response was: ${JSON.stringify(response)}`);
          setContent('');
        }
      } catch (e: any) {
        console.error("Error loading documentation:", e);
        setError(`Error loading documentation content from ${path}: ${e.message}`);
        setContent('');
      }
    };

    loadContent(initialContentPath);
  }, [initialContentPath]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic here (e.g., filter content)
    console.log(`Searching for: ${term}`); // Placeholder
  };

  const filteredContent = searchTerm
    ? content.toLowerCase().includes(searchTerm.toLowerCase())
      ? content
      : 'No results found for your search.'
    : content;

  return (
    <ErrorBoundary>
      <div>
        <h1>Documentation</h1>
        <SearchBar onSearch={handleSearch} />
        {error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: filteredContent }} /> // Assuming content is markdown/HTML
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DocsComponent;