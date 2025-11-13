// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching docs from an API endpoint
        // In a real application, replace this with an actual API call
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve([
              { id: 'getting-started', title: 'Getting Started', content: 'Welcome to our SaaS platform! This guide will help you get started.' },
              { id: 'api-reference', title: 'API Reference', content: 'Detailed documentation for our API endpoints.' },
              { id: 'faq', title: 'FAQ', content: 'Frequently asked questions about our platform.' },
            ]);
          }, 500) // Simulate a network request delay
        );

        setDocs(response as Doc[]);
      } catch (err: any) {
        setError(`Failed to fetch documentation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <Router>
      <div>
        <h1>Documentation</h1>
        <nav>
          <ul>
            {docs.map((doc) => (
              <li key={doc.id}>
                <Link to={`/docs/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Switch>
          {docs.map((doc) => (
            <Route key={doc.id} path={`/docs/${doc.id}`}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </Route>
          ))}
          <Route path="/docs">
            <p>Select a document from the navigation.</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Simulate fetching docs from an API endpoint
        // In a real application, replace this with an actual API call
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve([
              { id: 'getting-started', title: 'Getting Started', content: 'Welcome to our SaaS platform! This guide will help you get started.' },
              { id: 'api-reference', title: 'API Reference', content: 'Detailed documentation for our API endpoints.' },
              { id: 'faq', title: 'FAQ', content: 'Frequently asked questions about our platform.' },
            ]);
          }, 500) // Simulate a network request delay
        );

        setDocs(response as Doc[]);
      } catch (err: any) {
        setError(`Failed to fetch documentation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <Router>
      <div>
        <h1>Documentation</h1>
        <nav>
          <ul>
            {docs.map((doc) => (
              <li key={doc.id}>
                <Link to={`/docs/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Switch>
          {docs.map((doc) => (
            <Route key={doc.id} path={`/docs/${doc.id}`}>
              <h2>{doc.title}</h2>
              <p>{doc.content}</p>
            </Route>
          ))}
          <Route path="/docs">
            <p>Select a document from the navigation.</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Docs;