// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint
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

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      {docs.length > 0 ? (
        docs.map((doc) => (
          <div key={doc.id}>
            <h2>{doc.title}</h2>
            <p>{doc.content}</p>
          </div>
        ))
      ) : (
        <p>No documentation available.</p>
      )}
    </div>
  );
};

export default Docs;

// pages/api/docs.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const mockDocs: Doc[] = [
  {
    id: '1',
    title: 'Getting Started',
    content: 'Welcome to our SaaS! This guide will help you get started.'
  },
  {
    id: '2',
    title: 'API Reference',
    content: 'Our API allows you to integrate with our platform.'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc[]>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(mockDocs);
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    res.status(500).json([]); // Return an empty array in case of error
  }
}

// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error:", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// _app.tsx
import ErrorBoundary from '../src/components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs'); // Replace with your actual API endpoint
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

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      {docs.length > 0 ? (
        docs.map((doc) => (
          <div key={doc.id}>
            <h2>{doc.title}</h2>
            <p>{doc.content}</p>
          </div>
        ))
      ) : (
        <p>No documentation available.</p>
      )}
    </div>
  );
};

export default Docs;

// pages/api/docs.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const mockDocs: Doc[] = [
  {
    id: '1',
    title: 'Getting Started',
    content: 'Welcome to our SaaS! This guide will help you get started.'
  },
  {
    id: '2',
    title: 'API Reference',
    content: 'Our API allows you to integrate with our platform.'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc[]>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(mockDocs);
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    res.status(500).json([]); // Return an empty array in case of error
  }
}

// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error:", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// _app.tsx
import ErrorBoundary from '../src/components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp