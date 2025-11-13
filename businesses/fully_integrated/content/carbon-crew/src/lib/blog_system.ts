import { BlogPost, BlogPostInput, User } from './types';
import { validate, isEmpty } from 'class-validator';
import { MySQLConnection } from 'mysql2/promise';

export async function createBlogPost(
  connection: MySQLConnection,
  userId: number,
  input: BlogPostInput,
  title?: string,
  content?: string
): Promise<BlogPost | null> {
  // Validate input data
  const blogPostInput = new BlogPostInput();
  Object.assign(blogPostInput, input);
  const errors = await validate(blogPostInput);

  if (!isEmpty(errors)) {
    console.error('Validation errors:', errors);
    return null;
  }

  // Ensure title and content are provided
  if (!title || !content) {
    console.error('Missing title or content');
    return null;
  }

  // Prepare SQL query
  const query = `
    INSERT INTO blog_posts (user_id, title, content)
    VALUES (?, ?, ?)
  `;

  try {
    // Execute SQL query
    const [result] = await connection.execute(query, [userId, title, content]);

    if (result.affectedRows === 1) {
      // Fetch the newly created blog post
      const [newBlogPost] = await connection.execute(
        'SELECT * FROM blog_posts WHERE id = LAST_INSERT_ID()'
      );

      return newBlogPost as BlogPost;
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }

  console.error('Unexpected error creating blog post');
  return null;
}

import { BlogPost, BlogPostInput, User } from './types';
import { validate, isEmpty } from 'class-validator';
import { MySQLConnection } from 'mysql2/promise';

export async function createBlogPost(
  connection: MySQLConnection,
  userId: number,
  input: BlogPostInput,
  title?: string,
  content?: string
): Promise<BlogPost | null> {
  // Validate input data
  const blogPostInput = new BlogPostInput();
  Object.assign(blogPostInput, input);
  const errors = await validate(blogPostInput);

  if (!isEmpty(errors)) {
    console.error('Validation errors:', errors);
    return null;
  }

  // Ensure title and content are provided
  if (!title || !content) {
    console.error('Missing title or content');
    return null;
  }

  // Prepare SQL query
  const query = `
    INSERT INTO blog_posts (user_id, title, content)
    VALUES (?, ?, ?)
  `;

  try {
    // Execute SQL query
    const [result] = await connection.execute(query, [userId, title, content]);

    if (result.affectedRows === 1) {
      // Fetch the newly created blog post
      const [newBlogPost] = await connection.execute(
        'SELECT * FROM blog_posts WHERE id = LAST_INSERT_ID()'
      );

      return newBlogPost as BlogPost;
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return null;
  }

  console.error('Unexpected error creating blog post');
  return null;
}