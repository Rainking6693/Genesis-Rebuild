import { BlogPost } from './BlogPost';

interface BlogSystem {
  getBlogPost(id: number): Promise<BlogPost | null>;
}

class BlogSystemImpl implements BlogSystem {
  private blogPosts: Map<number, BlogPost>;

  constructor() {
    this.blogPosts = new Map();
    this.blogPosts.set(1, new BlogPost(1, 'Title 1', 'Content 1', new Date()));
    this.blogPosts.set(2, new BlogPost(2, 'Title 2', 'Content 2', new Date()));
  }

  async getBlogPost(id: number): Promise<BlogPost | null> {
    const blogPost = this.blogPosts.get(id);

    if (!blogPost) {
      // If the blog post is not found, return null and log an error message
      console.error(`Blog post with ID ${id} not found.`);
      return null;
    }

    return blogPost;
  }
}

// Usage
const blogSystem = new BlogSystemImpl();

// Handle the result
blogSystem.getBlogPost(1)
  .then((blogPost) => {
    if (blogPost) {
      console.log(blogPost.title);
    } else {
      console.log('Blog post not found.');
    }
  })
  .catch((error) => {
    console.error(error);
  });

import { BlogPost } from './BlogPost';

interface BlogSystem {
  getBlogPost(id: number): Promise<BlogPost | null>;
}

class BlogSystemImpl implements BlogSystem {
  private blogPosts: Map<number, BlogPost>;

  constructor() {
    this.blogPosts = new Map();
    this.blogPosts.set(1, new BlogPost(1, 'Title 1', 'Content 1', new Date()));
    this.blogPosts.set(2, new BlogPost(2, 'Title 2', 'Content 2', new Date()));
  }

  async getBlogPost(id: number): Promise<BlogPost | null> {
    const blogPost = this.blogPosts.get(id);

    if (!blogPost) {
      // If the blog post is not found, return null and log an error message
      console.error(`Blog post with ID ${id} not found.`);
      return null;
    }

    return blogPost;
  }
}

// Usage
const blogSystem = new BlogSystemImpl();

// Handle the result
blogSystem.getBlogPost(1)
  .then((blogPost) => {
    if (blogPost) {
      console.log(blogPost.title);
    } else {
      console.log('Blog post not found.');
    }
  })
  .catch((error) => {
    console.error(error);
  });