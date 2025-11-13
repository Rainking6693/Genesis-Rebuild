interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return await response.json();
}

async function fetchPosts(userId: number): Promise<Post[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return await response.json();
}

async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return await response.json();
}

async function displayUserPostsWithComments(userId: number): Promise<void> {
  try {
    const user = (await fetchUsers()).find(u => u.id === userId);

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return;
    }

    console.log(`User: ${user.name} (${user.email})`);

    const posts = await fetchPosts(userId);

    if (posts.length === 0) {
      console.log('No posts found for this user.');
      return;
    }

    for (const post of posts) {
      console.log(`\nPost: ${post.title}`);
      console.log(`Body: ${post.body}`);

      const comments = await fetchComments(post.id);

      if (comments.length > 0) {
        console.log('\nComments:');
        for (const comment of comments) {
          console.log(`  - ${comment.name} (${comment.email}): ${comment.body}`);
        }
      } else {
        console.log('  No comments for this post.');
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Example usage:
// displayUserPostsWithComments(1);

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return await response.json();
}

async function fetchPosts(userId: number): Promise<Post[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return await response.json();
}

async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return await response.json();
}

async function displayUserPostsWithComments(userId: number): Promise<void> {
  try {
    const user = (await fetchUsers()).find(u => u.id === userId);

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return;
    }

    console.log(`User: ${user.name} (${user.email})`);

    const posts = await fetchPosts(userId);

    if (posts.length === 0) {
      console.log('No posts found for this user.');
      return;
    }

    for (const post of posts) {
      console.log(`\nPost: ${post.title}`);
      console.log(`Body: ${post.body}`);

      const comments = await fetchComments(post.id);

      if (comments.length > 0) {
        console.log('\nComments:');
        for (const comment of comments) {
          console.log(`  - ${comment.name} (${comment.email}): ${comment.body}`);
        }
      } else {
        console.log('  No comments for this post.');
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Example usage:
// displayUserPostsWithComments(1);