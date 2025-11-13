interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
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

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return await response.json();
}

async function fetchComments(): Promise<Comment[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/comments');
  return await response.json();
}

async function getUserPosts(userId: number): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.filter(post => post.userId === userId);
}

async function getPostComments(postId: number): Promise<Comment[]> {
  const comments = await fetchComments();
  return comments.filter(comment => comment.postId === postId);
}

async function displayUserPostsAndComments(userId: number): Promise<void> {
  const userPosts = await getUserPosts(userId);

  for (const post of userPosts) {
    console.log(`Post ID: ${post.id}, Title: ${post.title}`);
    const postComments = await getPostComments(post.id);

    for (const comment of postComments) {
      console.log(`  Comment ID: ${comment.id}, Author: ${comment.name}, Body: ${comment.body}`);
    }
  }
}

async function main(): Promise<void> {
  const users = await fetchUsers();

  if (users.length > 0) {
    const firstUserId = users[0].id;
    console.log(`Displaying posts and comments for User ID: ${firstUserId}`);
    await displayUserPostsAndComments(firstUserId);
  } else {
    console.log('No users found.');
  }
}

// Example usage (call main function)
(async () => {
  await main();
})();

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
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

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return await response.json();
}

async function fetchComments(): Promise<Comment[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/comments');
  return await response.json();
}

async function getUserPosts(userId: number): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.filter(post => post.userId === userId);
}

async function getPostComments(postId: number): Promise<Comment[]> {
  const comments = await fetchComments();
  return comments.filter(comment => comment.postId === postId);
}

async function displayUserPostsAndComments(userId: number): Promise<void> {
  const userPosts = await getUserPosts(userId);

  for (const post of userPosts) {
    console.log(`Post ID: ${post.id}, Title: ${post.title}`);
    const postComments = await getPostComments(post.id);

    for (const comment of postComments) {
      console.log(`  Comment ID: ${comment.id}, Author: ${comment.name}, Body: ${comment.body}`);
    }
  }
}

async function main(): Promise<void> {
  const users = await fetchUsers();

  if (users.length > 0) {
    const firstUserId = users[0].id;
    console.log(`Displaying posts and comments for User ID: ${firstUserId}`);
    await displayUserPostsAndComments(firstUserId);
  } else {
    console.log('No users found.');
  }
}

// Example usage (call main function)
(async () => {
  await main();
})();