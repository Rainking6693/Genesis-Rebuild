import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
}

const SocialMediaFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err: any) {
        setError(`Failed to fetch posts: ${err.message}`);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/posts', { content: newPostContent });
      setPosts([...posts, response.data]);
      setNewPostContent('');
      setError(null);
    } catch (err: any) {
      setError(`Failed to create post: ${err.message}`);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (err: any) {
      setError(`Failed to like post: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Social Media Feed</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.author}:</strong> {post.content}
            <button onClick={() => handleLike(post.id)}>Like ({post.likes})</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaFeed;

// api/index.js (Node.js with Express - basic simulation)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let posts = [
  { id: 1, author: 'GenesisBot', content: 'Welcome to the social media feed!', likes: 0 },
];
let nextPostId = 2;

app.get('/api/posts', (req, res) => {
  try {
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    const newPost = { id: nextPostId++, author: 'User', content, likes: 0 };
    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

app.post('/api/posts/:id/like', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.likes++;
    res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});