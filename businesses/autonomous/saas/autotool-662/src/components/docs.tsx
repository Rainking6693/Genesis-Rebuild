// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs'); // Assuming an API endpoint for fetching docs
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Doc[] = await response.json();
        setDocs(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div>
      <h2>Documentation</h2>
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredDocs.length === 0 && searchTerm !== '' ? (
        <p>No results found for "{searchTerm}"</p>
      ) : (
        <ul>
          {filteredDocs.map(doc => (
            <li key={doc.id}>
              <h3>{doc.title}</h3>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs'); // Assuming an API endpoint for fetching docs
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Doc[] = await response.json();
        setDocs(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div>
      <h2>Documentation</h2>
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredDocs.length === 0 && searchTerm !== '' ? (
        <p>No results found for "{searchTerm}"</p>
      ) : (
        <ul>
          {filteredDocs.map(doc => (
            <li key={doc.id}>
              <h3>{doc.title}</h3>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Docs;