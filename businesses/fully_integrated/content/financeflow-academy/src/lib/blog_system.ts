import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  content: string;
}

const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await axios.get(`/api/blogs/${id}`);
    const data = response.data as BlogPost;
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
};

// Usage example
getBlogPostById(1)
  .then((post) => {
    if (post) {
      console.log(`Title: ${post.title}`);
      console.log(`Content: ${post.content}`);
    } else {
      console.log('Blog post not found.');
    }
  })
  .catch((error) => {
    console.error('An error occurred while fetching the blog post:', error);
  });

import axios from 'axios';

interface BlogPost {
  id: number;
  title: string;
  content: string;
}

const getBlogPostById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await axios.get(`/api/blogs/${id}`);
    const data = response.data as BlogPost;
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
};

// Usage example
getBlogPostById(1)
  .then((post) => {
    if (post) {
      console.log(`Title: ${post.title}`);
      console.log(`Content: ${post.content}`);
    } else {
      console.log('Blog post not found.');
    }
  })
  .catch((error) => {
    console.error('An error occurred while fetching the blog post:', error);
  });