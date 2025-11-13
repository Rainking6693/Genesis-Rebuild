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
        const response = await fetch('/api/docs'); // Assuming an API endpoint
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
  { id: '1', title: 'Getting Started', content: 'Welcome to our SaaS!...' },
  { id: '2', title: 'API Reference', content: 'Our API endpoints are...' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc[] | { message: string }>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(mockDocs);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// types/index.d.ts
export interface Doc {
  id: string;
  title: string;
  content: string;
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

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
        const response = await fetch('/api/docs'); // Assuming an API endpoint
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
  { id: '1', title: 'Getting Started', content: 'Welcome to our SaaS!...' },
  { id: '2', title: 'API Reference', content: 'Our API endpoints are...' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc[] | { message: string }>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(mockDocs);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// types/index.d.ts
export interface Doc {
  id: string;
  title: string;
  content: string;
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig