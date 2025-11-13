// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';

interface DocItem {
  title: string;
  path: string;
  content: string;
}

const docData: DocItem[] = [
  { title: 'Introduction', path: '/', content: 'Welcome to the SaaS documentation!' },
  { title: 'Getting Started', path: '/getting-started', content: 'Follow these steps to get started...' },
  { title: 'API Reference', path: '/api-reference', content: 'Detailed API documentation...' },
];

function DocContent({ path }: { path: string }) {
  const doc = docData.find(d => d.path === path);

  if (!doc) {
    return <div>Document not found.</div>;
  }

  return (
    <div>
      <h2>{doc.title}</h2>
      <p>{doc.content}</p>
    </div>
  );
}

function Documentation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      try {
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    }, 500);
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <div className="documentation">
        <nav>
          <ul>
            {docData.map(doc => (
              <li key={doc.path}>
                <Link to={doc.path}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main>
          <Routes>
            {docData.map(doc => (
              <Route key={doc.path} path={doc.path} element={<DocContent path={doc.path} />} />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';

interface DocItem {
  title: string;
  path: string;
  content: string;
}

const docData: DocItem[] = [
  { title: 'Introduction', path: '/', content: 'Welcome to the SaaS documentation!' },
  { title: 'Getting Started', path: '/getting-started', content: 'Follow these steps to get started...' },
  { title: 'API Reference', path: '/api-reference', content: 'Detailed API documentation...' },
];

function DocContent({ path }: { path: string }) {
  const doc = docData.find(d => d.path === path);

  if (!doc) {
    return <div>Document not found.</div>;
  }

  return (
    <div>
      <h2>{doc.title}</h2>
      <p>{doc.content}</p>
    </div>
  );
}

function Documentation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      try {
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    }, 500);
  }, []);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <div className="documentation">
        <nav>
          <ul>
            {docData.map(doc => (
              <li key={doc.path}>
                <Link to={doc.path}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main>
          <Routes>
            {docData.map(doc => (
              <Route key={doc.path} path={doc.path} element={<DocContent path={doc.path} />} />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Documentation;