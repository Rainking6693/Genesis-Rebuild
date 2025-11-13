// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { docId } = useParams<{ docId: string }>(); // Get docId from URL

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching docs from an API
        const response = await fetch('/api/docs');
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

  const currentDoc = docs.find((doc) => doc.id === docId);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="docs-container">
      <nav className="docs-nav">
        <ul>
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link to={`/docs/${doc.id}`}>{doc.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="docs-content">
        {currentDoc ? (
          <>
            <h1>{currentDoc.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: currentDoc.content }} />
          </>
        ) : (
          <div>Select a document from the navigation.</div>
        )}
      </main>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { docId } = useParams<{ docId: string }>(); // Get docId from URL

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching docs from an API
        const response = await fetch('/api/docs');
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

  const currentDoc = docs.find((doc) => doc.id === docId);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="docs-container">
      <nav className="docs-nav">
        <ul>
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link to={`/docs/${doc.id}`}>{doc.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="docs-content">
        {currentDoc ? (
          <>
            <h1>{currentDoc.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: currentDoc.content }} />
          </>
        ) : (
          <div>Select a document from the navigation.</div>
        )}
      </main>
    </div>
  );
};

export default Docs;