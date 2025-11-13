// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown
import { Read, Bash } from '../utils/tools'; // Assuming these are helper functions/components

interface Doc {
  title: string;
  content: string;
  path: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  // Load documentation files from a directory (e.g., /docs)
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // This is a placeholder.  In a real implementation, you'd need to
        // dynamically read the files from a directory.  This example assumes
        // a static array of paths.
        const docPaths = [
          '/docs/getting-started.md',
          '/docs/api-reference.md',
          '/docs/faq.md',
        ];

        const loadedDocs = await Promise.all(
          docPaths.map(async (path) => {
            try {
              const content = await Read({ file_path: path });
              const title = path.split('/').pop()?.replace('.md', '') || 'Untitled'; // Extract title from path
              return { title, content, path };
            } catch (error: any) {
              console.error(`Error reading doc ${path}:`, error);
              // Handle the error gracefully (e.g., display an error message)
              return { title: `Error: ${path}`, content: `Failed to load document.`, path: path };
            }
          })
        );

        setDocs(loadedDocs);
      } catch (error: any) {
        console.error("Error fetching docs:", error);
        // Handle the error gracefully (e.g., display an error message)
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

  const handleDocClick = (doc: Doc) => {
    setSelectedDoc(doc);
  };

  return (
    <div>
      <h1>Documentation</h1>
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', marginRight: '20px' }}>
          <h2>Table of Contents</h2>
          <ul>
            {filteredDocs.map((doc) => (
              <li key={doc.path} onClick={() => handleDocClick(doc)} style={{ cursor: 'pointer' }}>
                {doc.title}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: '70%' }}>
          {selectedDoc ? (
            <>
              <h2>{selectedDoc.title}</h2>
              <Markdown>{selectedDoc.content}</Markdown>
            </>
          ) : (
            <p>Select a document from the table of contents.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'; // Assuming react-markdown is used for rendering Markdown
import { Read, Bash } from '../utils/tools'; // Assuming these are helper functions/components

interface Doc {
  title: string;
  content: string;
  path: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  // Load documentation files from a directory (e.g., /docs)
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // This is a placeholder.  In a real implementation, you'd need to
        // dynamically read the files from a directory.  This example assumes
        // a static array of paths.
        const docPaths = [
          '/docs/getting-started.md',
          '/docs/api-reference.md',
          '/docs/faq.md',
        ];

        const loadedDocs = await Promise.all(
          docPaths.map(async (path) => {
            try {
              const content = await Read({ file_path: path });
              const title = path.split('/').pop()?.replace('.md', '') || 'Untitled'; // Extract title from path
              return { title, content, path };
            } catch (error: any) {
              console.error(`Error reading doc ${path}:`, error);
              // Handle the error gracefully (e.g., display an error message)
              return { title: `Error: ${path}`, content: `Failed to load document.`, path: path };
            }
          })
        );

        setDocs(loadedDocs);
      } catch (error: any) {
        console.error("Error fetching docs:", error);
        // Handle the error gracefully (e.g., display an error message)
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

  const handleDocClick = (doc: Doc) => {
    setSelectedDoc(doc);
  };

  return (
    <div>
      <h1>Documentation</h1>
      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', marginRight: '20px' }}>
          <h2>Table of Contents</h2>
          <ul>
            {filteredDocs.map((doc) => (
              <li key={doc.path} onClick={() => handleDocClick(doc)} style={{ cursor: 'pointer' }}>
                {doc.title}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ width: '70%' }}>
          {selectedDoc ? (
            <>
              <h2>{selectedDoc.title}</h2>
              <Markdown>{selectedDoc.content}</Markdown>
            </>
          ) : (
            <p>Select a document from the table of contents.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;