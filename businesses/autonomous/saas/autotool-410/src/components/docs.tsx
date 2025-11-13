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
    content: 'Welcome to our SaaS platform! This guide will help you get started.'
  },
  {
    id: '2',
    title: 'API Reference',
    content: 'Our API allows you to integrate with our platform programmatically.'
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
    console.error("API Error:", error);
    res.status(500).json([]); // Return an empty array on error to prevent client-side crashes
  }
}

// src/types/index.ts

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

// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};

// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}

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
    content: 'Welcome to our SaaS platform! This guide will help you get started.'
  },
  {
    id: '2',
    title: 'API Reference',
    content: 'Our API allows you to integrate with our platform programmatically.'
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
    console.error("API Error:", error);
    res.status(500).json([]); // Return an empty array on error to prevent client-side crashes
  }
}

// src/types/index.ts

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

// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};

// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}