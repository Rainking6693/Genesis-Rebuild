// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { searchDocs } from '../utils/search'; // Assuming a search utility
import { fetchDocs } from '../api/docs'; // Assuming an API endpoint for fetching docs

interface Doc {
  id: string;
  title: string;
  content: string;
}

function Docs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const fetchedDocs = await fetchDocs();
        setDocs(fetchedDocs);
        setFilteredDocs(fetchedDocs); // Initially show all docs
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to load documentation: ${err.message}`);
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const results = searchDocs(docs, term); // Assuming searchDocs returns filtered results
    setFilteredDocs(results);
  };

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
        <div>No results found for "{searchTerm}"</div>
      ) : (
        <ul>
          {filteredDocs.map((doc) => (
            <li key={doc.id}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { searchDocs } from '../utils/search'; // Assuming a search utility
import { fetchDocs } from '../api/docs'; // Assuming an API endpoint for fetching docs

interface Doc {
  id: string;
  title: string;
  content: string;
}

function Docs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const fetchedDocs = await fetchDocs();
        setDocs(fetchedDocs);
        setFilteredDocs(fetchedDocs); // Initially show all docs
        setLoading(false);
      } catch (err: any) {
        setError(`Failed to load documentation: ${err.message}`);
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const results = searchDocs(docs, term); // Assuming searchDocs returns filtered results
    setFilteredDocs(results);
  };

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
        <div>No results found for "{searchTerm}"</div>
      ) : (
        <ul>
          {filteredDocs.map((doc) => (
            <li key={doc.id}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Docs;

Now, I will use the `Write` tool to save the code to `src/components/Docs.tsx`.

Finally, I will create the build report.