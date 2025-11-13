// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar'; // Assuming a SearchBar component exists
import { fetchDocs } from '../api/docsService'; // Assuming an API service exists

interface Doc {
  id: string;
  title: string;
  content: string;
}

interface DocsComponentProps {
  businessType: string; // Add business type prop
}

const DocsComponent: React.FC<DocsComponentProps> = ({ businessType }) => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedDocs = await fetchDocs(businessType); // Pass business type
        setDocs(fetchedDocs);
      } catch (err: any) {
        console.error("Error fetching docs:", err);
        setError("Failed to load documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [businessType]);

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      <SearchBar onSearch={setSearchTerm} />
      {filteredDocs.length === 0 && <p>No results found.</p>}
      {filteredDocs.map(doc => (
        <div key={doc.id}>
          <h2>{doc.title}</h2>
          <p>{doc.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DocsComponent;

// src/components/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search documentation..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar'; // Assuming a SearchBar component exists
import { fetchDocs } from '../api/docsService'; // Assuming an API service exists

interface Doc {
  id: string;
  title: string;
  content: string;
}

interface DocsComponentProps {
  businessType: string; // Add business type prop
}

const DocsComponent: React.FC<DocsComponentProps> = ({ businessType }) => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedDocs = await fetchDocs(businessType); // Pass business type
        setDocs(fetchedDocs);
      } catch (err: any) {
        console.error("Error fetching docs:", err);
        setError("Failed to load documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [businessType]);

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      <SearchBar onSearch={setSearchTerm} />
      {filteredDocs.length === 0 && <p>No results found.</p>}
      {filteredDocs.map(doc => (
        <div key={doc.id}>
          <h2>{doc.title}</h2>
          <p>{doc.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DocsComponent;

// src/components/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search documentation..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

// src/api/docsService.js
// Mock implementation - replace with actual API call
export const fetchDocs = async (businessType) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data based on business type
  if (businessType === 'saas') {
    return [
      { id: '1', title: 'Getting Started', content: 'Welcome to our SaaS platform!...' },
      { id: '2', title: 'API Reference', content: 'Our API allows you to integrate...' },
    ];
  } else {
    return []; // Or a default set of docs
  }
};