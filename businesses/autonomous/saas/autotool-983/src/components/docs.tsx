// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation from an API endpoint
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data = await response.json();
        setDocs(data);
      } catch (err: any) {
        console.error("Error fetching docs:", err);
        setError("Failed to load documentation. Please try again later.");
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Documentation</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <div key={doc.id}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </div>
          ))
        ) : (
          <p>No documentation found.</p>
        )}
      </div>
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

const Docs: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation from an API endpoint
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const data = await response.json();
        setDocs(data);
      } catch (err: any) {
        console.error("Error fetching docs:", err);
        setError("Failed to load documentation. Please try again later.");
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Documentation</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <div key={doc.id}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </div>
          ))
        ) : (
          <p>No documentation found.</p>
        )}
      </div>
    </div>
  );
};

export default Docs;