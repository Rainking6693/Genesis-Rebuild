// src/components/SocialMediaFeed.tsx
import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  author: string;
  date: string;
  likes: number;
}

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulate fetching posts from an API
        const response = await new Promise<Post[]>((resolve) => {
          setTimeout(() => {
            const mockPosts: Post[] = [
              { id: 1, content: 'Check out our new blog post!', author: 'Genesis Team', date: '2025-11-07', likes: 15 },
              { id: 2, content: 'Exciting news coming soon!', author: 'Genesis Team', date: '2025-11-06', likes: 22 },
            ];
            resolve(mockPosts);
          }, 500); // Simulate API latency
        });

        setPosts(response);
      } catch (e: any) {
        setError(`Failed to fetch posts: ${e.message}`);
      }
    };

    fetchPosts();
  }, []);

  const handleShare = (postId: number) => {
    try {
      // Simulate sharing functionality
      console.log(`Sharing post with ID: ${postId}`);
      alert(`Sharing post with ID: ${postId} (This is a simulation)`);
    } catch (e: any) {
      console.error(`Error sharing post: ${e.message}`);
      alert(`Error sharing post: ${e.message}`); // Basic error display
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Social Media Feed</h2>
      {posts.length === 0 ? (
        <div>Loading...</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p>{post.content}</p>
            <p>Author: {post.author}</p>
            <p>Date: {post.date}</p>
            <p>Likes: {post.likes}</p>
            <button onClick={() => handleShare(post.id)}>Share</button>
          </div>
        ))
      )}
      {/* Add tests here to verify rendering and functionality */}
    </div>
  );
};

export default SocialMediaFeed;

// src/components/SocialMediaFeed.tsx
import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  author: string;
  date: string;
  likes: number;
}

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulate fetching posts from an API
        const response = await new Promise<Post[]>((resolve) => {
          setTimeout(() => {
            const mockPosts: Post[] = [
              { id: 1, content: 'Check out our new blog post!', author: 'Genesis Team', date: '2025-11-07', likes: 15 },
              { id: 2, content: 'Exciting news coming soon!', author: 'Genesis Team', date: '2025-11-06', likes: 22 },
            ];
            resolve(mockPosts);
          }, 500); // Simulate API latency
        });

        setPosts(response);
      } catch (e: any) {
        setError(`Failed to fetch posts: ${e.message}`);
      }
    };

    fetchPosts();
  }, []);

  const handleShare = (postId: number) => {
    try {
      // Simulate sharing functionality
      console.log(`Sharing post with ID: ${postId}`);
      alert(`Sharing post with ID: ${postId} (This is a simulation)`);
    } catch (e: any) {
      console.error(`Error sharing post: ${e.message}`);
      alert(`Error sharing post: ${e.message}`); // Basic error display
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Social Media Feed</h2>
      {posts.length === 0 ? (
        <div>Loading...</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p>{post.content}</p>
            <p>Author: {post.author}</p>
            <p>Date: {post.date}</p>
            <p>Likes: {post.likes}</p>
            <button onClick={() => handleShare(post.id)}>Share</button>
          </div>
        ))
      )}
      {/* Add tests here to verify rendering and functionality */}
    </div>
  );
};

export default SocialMediaFeed;