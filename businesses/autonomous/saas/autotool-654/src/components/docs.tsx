// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocSectionProps {
  title: string;
  content: string;
}

const DocSection: React.FC<DocSectionProps> = ({ title, content }) => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
};

const Docs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docsContent, setDocsContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation content from an API or file
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const fetchedContent = {
          "Getting Started": "Welcome to our SaaS platform!  Follow these steps to get started...",
          "API Reference": "Our API is RESTful and uses JSON.  See the endpoints below...",
          "FAQs": "Frequently Asked Questions and their answers...",
          "Support": "Contact our support team at support@example.com"
        };

        setDocsContent(fetchedContent);
        setLoading(false);
      } catch (e: any) {
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <h1>Documentation</h1>
      {Object.entries(docsContent).map(([title, content]) => (
        <DocSection key={title} title={title} content={content} />
      ))}
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocSectionProps {
  title: string;
  content: string;
}

const DocSection: React.FC<DocSectionProps> = ({ title, content }) => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
};

const Docs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docsContent, setDocsContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching documentation content from an API or file
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const fetchedContent = {
          "Getting Started": "Welcome to our SaaS platform!  Follow these steps to get started...",
          "API Reference": "Our API is RESTful and uses JSON.  See the endpoints below...",
          "FAQs": "Frequently Asked Questions and their answers...",
          "Support": "Contact our support team at support@example.com"
        };

        setDocsContent(fetchedContent);
        setLoading(false);
      } catch (e: any) {
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="docs-container">
      <h1>Documentation</h1>
      {Object.entries(docsContent).map(([title, content]) => (
        <DocSection key={title} title={title} content={content} />
      ))}
    </div>
  );
};

export default Docs;