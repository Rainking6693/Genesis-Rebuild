// src/components/BlogSystem.tsx

import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const BlogSystem = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BlogPost[] = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author} on {post.date}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogSystem;

// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Post = {
  id: number
  title: string
  content: string
  author: string
  date: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post.',
    author: 'John Doe',
    date: '2024-01-01'
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'This is the second post.',
    author: 'Jane Smith',
    date: '2024-01-02'
  }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(posts)
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    console.error(error)
    res.status(500).json([]) // Return empty array on error
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
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
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

// src/components/BlogSystem.tsx

import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const BlogSystem = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BlogPost[] = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author} on {post.date}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogSystem;

// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Post = {
  id: number
  title: string
  content: string
  author: string
  date: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post.',
    author: 'John Doe',
    date: '2024-01-01'
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'This is the second post.',
    author: 'Jane Smith',
    date: '2024-01-02'
  }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[]>
) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(posts)
    } else {
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    console.error(error)
    res.status(500).json([]) // Return empty array on error
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
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
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