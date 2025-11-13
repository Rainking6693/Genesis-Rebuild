// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// Mock documentation content (replace with actual markdown files)
const docsContent = {
  'getting-started': `# Getting Started\nWelcome to our SaaS! This guide will help you get started.`,
  'api-reference': `# API Reference\nDetailed information about our API endpoints.`,
  'faq': `# FAQ\nFrequently asked questions and answers.`
};

function Docs() {
  const [currentDoc, setCurrentDoc] = useState('getting-started');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching documentation content (replace with actual API call or file read)
    try {
      // Check if the document exists
      if (!docsContent[currentDoc]) {
        throw new Error(`Document "${currentDoc}" not found.`);
      }
    } catch (e) {
      setError(e.message);
    }
  }, [currentDoc]);

  const handleNavigation = (docName: string) => {
    setCurrentDoc(docName);
    setError(null); // Clear any previous errors
  };

  if (error) {
    return (
      <div className="docs">
        <h1>Documentation</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="docs">
      <h1>Documentation</h1>
      <nav>
        <ul>
          <li><Link to="/docs/getting-started" onClick={() => handleNavigation('getting-started')}>Getting Started</Link></li>
          <li><Link to="/docs/api-reference" onClick={() => handleNavigation('api-reference')}>API Reference</Link></li>
          <li><Link to="/docs/faq" onClick={() => handleNavigation('faq')}>FAQ</Link></li>
        </ul>
      </nav>
      <div className="content">
        <ReactMarkdown>{docsContent[currentDoc]}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Docs;