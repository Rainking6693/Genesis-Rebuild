// src/components/BlogSystem.tsx
import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
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
        // Simulate fetching posts from an API
        const response = await fetch('/api/posts'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
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
    return <div>Loading blog posts...</div>;
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

Now, I will use the `Write` tool to save the code to a file.