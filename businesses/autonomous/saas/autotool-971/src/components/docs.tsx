// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/api'; // Assuming you have a utility for reading files

interface DocItem {
  title: string;
  path: string;
}

const Docs: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Example Documentation Items (replace with actual data source)
  const docItems: DocItem[] = [
    { title: 'Introduction', path: '/docs/introduction.md' },
    { title: 'Getting Started', path: '/docs/getting-started.md' },
    { title: 'API Reference', path: '/docs/api-reference.md' },
  ];

  useEffect(() => {
    const loadDoc = async (path: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await Read({ file_path: path });
        if (typeof response === 'string') {
          setDocContent(response);
        } else {
          throw new Error("Failed to read documentation file.");
        }
      } catch (e: any) {
        console.error("Error loading documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setDocContent('');
      } finally {
        setLoading(false);
      }
    };

    if (currentDoc) {
      loadDoc(currentDoc);
    }
  }, [currentDoc]);

  const handleDocClick = (path: string) => {
    setCurrentDoc(path);
  };

  return (
    <div className="docs-container">
      <nav className="docs-nav">
        <h2>Documentation</h2>
        <ul>
          {docItems.map((item) => (
            <li key={item.path}>
              <button onClick={() => handleDocClick(item.path)}>{item.title}</button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="docs-content">
        {loading && <p>Loading...</p>}
        {error && <div className="error-message">{error}</div>}
        {docContent && <div dangerouslySetInnerHTML={{ __html: docContent }} />}
      </main>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/api'; // Assuming you have a utility for reading files

interface DocItem {
  title: string;
  path: string;
}

const Docs: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Example Documentation Items (replace with actual data source)
  const docItems: DocItem[] = [
    { title: 'Introduction', path: '/docs/introduction.md' },
    { title: 'Getting Started', path: '/docs/getting-started.md' },
    { title: 'API Reference', path: '/docs/api-reference.md' },
  ];

  useEffect(() => {
    const loadDoc = async (path: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await Read({ file_path: path });
        if (typeof response === 'string') {
          setDocContent(response);
        } else {
          throw new Error("Failed to read documentation file.");
        }
      } catch (e: any) {
        console.error("Error loading documentation:", e);
        setError(`Failed to load documentation: ${e.message}`);
        setDocContent('');
      } finally {
        setLoading(false);
      }
    };

    if (currentDoc) {
      loadDoc(currentDoc);
    }
  }, [currentDoc]);

  const handleDocClick = (path: string) => {
    setCurrentDoc(path);
  };

  return (
    <div className="docs-container">
      <nav className="docs-nav">
        <h2>Documentation</h2>
        <ul>
          {docItems.map((item) => (
            <li key={item.path}>
              <button onClick={() => handleDocClick(item.path)}>{item.title}</button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="docs-content">
        {loading && <p>Loading...</p>}
        {error && <div className="error-message">{error}</div>}
        {docContent && <div dangerouslySetInnerHTML={{ __html: docContent }} />}
      </main>
    </div>
  );
};

export default Docs;