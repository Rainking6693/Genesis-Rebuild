// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  title: string;
  content: string;
  id: string;
}

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Placeholder for fetching documentation data from an API or local files
        // Replace with actual data fetching logic
        const mockDocs: Doc[] = [
          { id: '1', title: 'Getting Started', content: 'This is the getting started guide.' },
          { id: '2', title: 'API Reference', content: 'Details about the API endpoints.' },
        ];
        setDocs(mockDocs);
      } catch (err: any) {
        setError(`Failed to load documentation: ${err.message}`);
      } finally {
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
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
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
              <h2>{doc.title}</h2>
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
  title: string;
  content: string;
  id: string;
}

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Placeholder for fetching documentation data from an API or local files
        // Replace with actual data fetching logic
        const mockDocs: Doc[] = [
          { id: '1', title: 'Getting Started', content: 'This is the getting started guide.' },
          { id: '2', title: 'API Reference', content: 'Details about the API endpoints.' },
        ];
        setDocs(mockDocs);
      } catch (err: any) {
        setError(`Failed to load documentation: ${err.message}`);
      } finally {
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
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
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
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Docs;