// src/components/SocialMedia.tsx

import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  author: string;
  likes: number;
  timestamp: Date;
}

const SocialMedia = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch posts: ${e.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost: Omit<Post, 'id' | 'likes' | 'timestamp'> = {
        content: newPostContent,
        author: 'CurrentUser', // Replace with actual user authentication
      };

      const response = await fetch('/api/posts', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPost: Post = await response.json();
      setPosts([...posts, createdPost]);
      setNewPostContent('');
      setError(null);
    } catch (e: any) {
      setError(`Failed to create post: ${e.message}`);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, { // Replace with your actual API endpoint
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost: Post = await response.json();
      setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
    } catch (e: any) {
      setError(`Failed to like post: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Social Media Feed</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit">Post</button>
      </form>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          <p>Likes: {post.likes}</p>
          <p>Timestamp: {post.timestamp.toString()}</p>
          <button onClick={() => handleLike(post.id)}>Like</button>
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;

// src/components/SocialMedia.tsx

import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  author: string;
  likes: number;
  timestamp: Date;
}

const SocialMedia = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (e: any) {
        setError(`Failed to fetch posts: ${e.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost: Omit<Post, 'id' | 'likes' | 'timestamp'> = {
        content: newPostContent,
        author: 'CurrentUser', // Replace with actual user authentication
      };

      const response = await fetch('/api/posts', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPost: Post = await response.json();
      setPosts([...posts, createdPost]);
      setNewPostContent('');
      setError(null);
    } catch (e: any) {
      setError(`Failed to create post: ${e.message}`);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, { // Replace with your actual API endpoint
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost: Post = await response.json();
      setPosts(posts.map(post => (post.id === postId ? updatedPost : post)));
    } catch (e: any) {
      setError(`Failed to like post: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Social Media Feed</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit">Post</button>
      </form>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          <p>Likes: {post.likes}</p>
          <p>Timestamp: {post.timestamp.toString()}</p>
          <button onClick={() => handleLike(post.id)}>Like</button>
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;