// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  id: string;
  title: string;
  content: string;
  version: string;
}

const Documentation = () => {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching documentation from an API
        const response = await fetch(`/api/docs/${docId}`); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Doc = await response.json();
        setDoc(data);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error(e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  const handleEdit = () => {
    history.push(`/docs/${docId}/edit`); // Navigate to edit page
  };

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!doc) {
    return <div>Documentation not found.</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>Version: {doc.version}</p>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} /> {/* Assuming content is HTML */}
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'; // Assuming React Router for navigation

interface Doc {
  id: string;
  title: string;
  content: string;
  version: string;
}

const Documentation = () => {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching documentation from an API
        const response = await fetch(`/api/docs/${docId}`); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Doc = await response.json();
        setDoc(data);
      } catch (e: any) {
        setError(`Failed to load documentation: ${e.message}`);
        console.error(e); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  const handleEdit = () => {
    history.push(`/docs/${docId}/edit`); // Navigate to edit page
  };

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!doc) {
    return <div>Documentation not found.</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>Version: {doc.version}</p>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} /> {/* Assuming content is HTML */}
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default Documentation;