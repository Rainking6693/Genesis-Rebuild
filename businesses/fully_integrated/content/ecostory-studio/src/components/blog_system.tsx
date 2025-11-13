import { BlogPost, BlogPostInput } from './BlogPost';
import { User } from './User';

async function createBlogPost(input: BlogPostInput, user: User): Promise<BlogPost | null> {
  // Validate input
  if (!input.title || !input.content || !input.authorId) {
    throw new Error('Missing required fields: title, content, authorId');
  }

  // Check if the author exists
  const author = await User.findById(input.authorId);
  if (!author) {
    throw new Error('Author not found');
  }

  // Create the blog post
  const blogPost = new BlogPost({
    title: input.title,
    content: input.content,
    authorId: input.authorId,
  });

  try {
    // Save the blog post to the database
    await blogPost.save();
  } catch (error) {
    // Handle database errors
    console.error(error);
    return null;
  }

  return blogPost;
}

import { BlogPost, BlogPostInput } from './BlogPost';
import { User } from './User';

async function createBlogPost(input: BlogPostInput, user: User): Promise<BlogPost | null> {
  // Validate input
  if (!input.title || !input.content || !input.authorId) {
    throw new Error('Missing required fields: title, content, authorId');
  }

  // Check if the author exists
  const author = await User.findById(input.authorId);
  if (!author) {
    throw new Error('Author not found');
  }

  // Create the blog post
  const blogPost = new BlogPost({
    title: input.title,
    content: input.content,
    authorId: input.authorId,
  });

  try {
    // Save the blog post to the database
    await blogPost.save();
  } catch (error) {
    // Handle database errors
    console.error(error);
    return null;
  }

  return blogPost;
}