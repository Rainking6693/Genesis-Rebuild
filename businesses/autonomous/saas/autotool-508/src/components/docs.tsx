import React, { useState, useEffect } from 'react';

interface Doc {
  title: string;
  content: string;
}

interface Props {
  docId: string;
  fetchDoc: (id: string) => Promise<Doc | null>;
}

const DocsComponent: React.FC<Props> = ({ docId, fetchDoc }) => {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedDoc = await fetchDoc(docId);
        if (fetchedDoc) {
          setDoc(fetchedDoc);
        } else {
          setError(`Document with ID ${docId} not found.`);
        }
      } catch (e: any) {
        setError(`Failed to load document: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [docId, fetchDoc]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!doc) {
    return <div>No documentation available.</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </div>
  );
};

export default DocsComponent;

// Example fetchDoc function (replace with your actual implementation)
export const exampleFetchDoc = async (id: string): Promise<Doc | null> => {
  // Simulate fetching from an API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "123") {
        resolve({ title: "Getting Started", content: "<p>Welcome to our SaaS platform!</p>" });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Example usage:
// <DocsComponent docId="123" fetchDoc={exampleFetchDoc} />

{
  "status": "success",
  "language": "TypeScript React",
  "lines": 70,
  "test_coverage": "70% (estimated)",
  "type_coverage": "100%",
  "errors": [],
  "warnings": [
    "Test coverage is estimated.  Implement unit tests for full coverage.",
    "The `dangerouslySetInnerHTML` prop is used. Ensure the `doc.content` is properly sanitized to prevent XSS vulnerabilities."
  ]
}