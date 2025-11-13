// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

interface DocSection {
  title: string;
  content: string;
  path: string;
}

const docSections: DocSection[] = [
  { title: 'Getting Started', content: 'Welcome to our SaaS platform! This guide will help you get started.', path: '/getting-started' },
  { title: 'API Reference', content: 'Our API is RESTful and easy to use.  See the endpoints below.', path: '/api-reference' },
  { title: 'Troubleshooting', content: 'Having trouble? Check out our troubleshooting guide.', path: '/troubleshooting' },
];

function Docs() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching documentation content (replace with actual API call)
    const fetchData = async () => {
      try {
        // No actual fetch, just simulating a delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err: any) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h1>Error Loading Documentation</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <h1>Documentation</h1>
        <nav>
          <ul>
            {docSections.map(section => (
              <li key={section.path}>
                <Link to={section.path}>{section.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Switch>
          {docSections.map(section => (
            <Route key={section.path} path={section.path}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </Route>
          ))}
          <Route path="/">
            <h2>Welcome to the Documentation!</h2>
            <p>Choose a section from the navigation above.</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

interface DocSection {
  title: string;
  content: string;
  path: string;
}

const docSections: DocSection[] = [
  { title: 'Getting Started', content: 'Welcome to our SaaS platform! This guide will help you get started.', path: '/getting-started' },
  { title: 'API Reference', content: 'Our API is RESTful and easy to use.  See the endpoints below.', path: '/api-reference' },
  { title: 'Troubleshooting', content: 'Having trouble? Check out our troubleshooting guide.', path: '/troubleshooting' },
];

function Docs() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching documentation content (replace with actual API call)
    const fetchData = async () => {
      try {
        // No actual fetch, just simulating a delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err: any) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h1>Error Loading Documentation</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <h1>Documentation</h1>
        <nav>
          <ul>
            {docSections.map(section => (
              <li key={section.path}>
                <Link to={section.path}>{section.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Switch>
          {docSections.map(section => (
            <Route key={section.path} path={section.path}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </Route>
          ))}
          <Route path="/">
            <h2>Welcome to the Documentation!</h2>
            <p>Choose a section from the navigation above.</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Docs;

Now, let's create the build report: