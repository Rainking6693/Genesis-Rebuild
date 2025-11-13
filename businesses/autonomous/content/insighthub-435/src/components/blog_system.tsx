// src/components/BlogSystem.tsx
import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

const BlogSystem = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState<BlogPost>({
    id: '',
    title: '',
    content: '',
    author: '',
    createdAt: new Date(),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching blog posts from an API
    const fetchPosts = async () => {
      try {
        // Replace with actual API call
        const response = await new Promise<BlogPost[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: '1',
                title: 'First Post',
                content: 'This is the first blog post.',
                author: 'John Doe',
                createdAt: new Date(),
              },
              {
                id: '2',
                title: 'Second Post',
                content: 'This is the second blog post.',
                author: 'Jane Doe',
                createdAt: new Date(),
              },
            ]);
          }, 500); // Simulate API latency
        });
        setPosts(response);
      } catch (e: any) {
        setError(`Error fetching posts: ${e.message}`);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const createPost = async () => {
    try {
      if (!newPost.title || !newPost.content || !newPost.author) {
        throw new Error('All fields are required.');
      }

      // Simulate API call to create a new post
      const newPostWithId = { ...newPost, id: String(Date.now()), createdAt: new Date() };
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency

      setPosts([...posts, newPostWithId]);
      setNewPost({ id: '', title: '', content: '', author: '', createdAt: new Date() });
      setError(null);
    } catch (e: any) {
      setError(`Error creating post: ${e.message}`);
    }
  };

  const deletePost = async (id: string) => {
    try {
      // Simulate API call to delete a post
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency
      setPosts(posts.filter((post) => post.id !== id));
      setError(null);
    } catch (e: any) {
      setError(`Error deleting post: ${e.message}`);
    }
  };

  return (
    <div>
      <h1>Blog System</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <h2>Create New Post</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newPost.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newPost.author}
          onChange={handleInputChange}
        />
        <button onClick={createPost}>Create Post</button>
      </div>

      <div>
        <h2>Existing Posts</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Author: {post.author}</p>
            <p>Created At: {post.createdAt.toLocaleDateString()}</p>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSystem;

// src/components/BlogSystem.tsx
import React, { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

const BlogSystem = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState<BlogPost>({
    id: '',
    title: '',
    content: '',
    author: '',
    createdAt: new Date(),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching blog posts from an API
    const fetchPosts = async () => {
      try {
        // Replace with actual API call
        const response = await new Promise<BlogPost[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: '1',
                title: 'First Post',
                content: 'This is the first blog post.',
                author: 'John Doe',
                createdAt: new Date(),
              },
              {
                id: '2',
                title: 'Second Post',
                content: 'This is the second blog post.',
                author: 'Jane Doe',
                createdAt: new Date(),
              },
            ]);
          }, 500); // Simulate API latency
        });
        setPosts(response);
      } catch (e: any) {
        setError(`Error fetching posts: ${e.message}`);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const createPost = async () => {
    try {
      if (!newPost.title || !newPost.content || !newPost.author) {
        throw new Error('All fields are required.');
      }

      // Simulate API call to create a new post
      const newPostWithId = { ...newPost, id: String(Date.now()), createdAt: new Date() };
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency

      setPosts([...posts, newPostWithId]);
      setNewPost({ id: '', title: '', content: '', author: '', createdAt: new Date() });
      setError(null);
    } catch (e: any) {
      setError(`Error creating post: ${e.message}`);
    }
  };

  const deletePost = async (id: string) => {
    try {
      // Simulate API call to delete a post
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API latency
      setPosts(posts.filter((post) => post.id !== id));
      setError(null);
    } catch (e: any) {
      setError(`Error deleting post: ${e.message}`);
    }
  };

  return (
    <div>
      <h1>Blog System</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <h2>Create New Post</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newPost.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newPost.author}
          onChange={handleInputChange}
        />
        <button onClick={createPost}>Create Post</button>
      </div>

      <div>
        <h2>Existing Posts</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Author: {post.author}</p>
            <p>Created At: {post.createdAt.toLocaleDateString()}</p>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSystem;