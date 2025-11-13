import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

async function fetchBlogPosts(page: number = 1): Promise<BlogPost[]> {
  try {
    const response = await axios.get(`https://api.example.com/blog?page=${page}`);
    const data = response.data as BlogPost[];

    // Edge case: Check if the response is empty
    if (data.length === 0) {
      throw new Error('No blog posts found');
    }

    // Edge case: Check if the response contains invalid data
    data.forEach((post) => {
      if (!post.id || !post.title || !post.content || !post.createdAt) {
        throw new Error('Invalid blog post data');
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

async function fetchBlogPosts(page: number = 1): Promise<BlogPost[]> {
  try {
    const response = await axios.get(`https://api.example.com/blog?page=${page}`);
    const data = response.data as BlogPost[];

    // Edge case: Check if the response is empty
    if (data.length === 0) {
      throw new Error('No blog posts found');
    }

    // Edge case: Check if the response contains invalid data
    data.forEach((post) => {
      if (!post.id || !post.title || !post.content || !post.createdAt) {
        throw new Error('Invalid blog post data');
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}