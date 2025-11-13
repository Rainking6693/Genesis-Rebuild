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

async function enrichPostsWithUserDetails(posts: Post[], users: User[]): Promise<(Post & { user: User })[]> {
  return posts.map(post => {
    const user = users.find(user => user.id === post.userId);
    if (user) {
      return { ...post, user };
    } else {
      return { ...post, user: { id: -1, name: 'Unknown User', email: 'unknown@example.com' } };
    }
  });
}

async function getPostsByUserId(userId: number, posts: Post[]): Promise<Post[]> {
  return posts.filter(post => post.userId === userId);
}

async function getCommentsByPostId(postId: number, comments: Comment[]): Promise<Comment[]> {
  return comments.filter(comment => comment.postId === postId);
}

async function main() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  const enrichedPosts = await enrichPostsWithUserDetails(posts, users);

  const userIdToFilter = 1;
  const postsForUser = await getPostsByUserId(userIdToFilter, enrichedPosts);

  console.log(`Posts for user ID ${userIdToFilter}:`, postsForUser);

  if (postsForUser.length > 0) {
    const firstPostId = postsForUser[0].id;
    const commentsForPost = await getCommentsByPostId(firstPostId, comments);
    console.log(`Comments for post ID ${firstPostId}:`, commentsForPost);
  } else {
    console.log(`No posts found for user ID ${userIdToFilter}.`);
  }
}

if (require.main === module) {
  main().catch(error => console.error("An error occurred:", error));
}

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

async function enrichPostsWithUserDetails(posts: Post[], users: User[]): Promise<(Post & { user: User })[]> {
  return posts.map(post => {
    const user = users.find(user => user.id === post.userId);
    if (user) {
      return { ...post, user };
    } else {
      return { ...post, user: { id: -1, name: 'Unknown User', email: 'unknown@example.com' } };
    }
  });
}

async function getPostsByUserId(userId: number, posts: Post[]): Promise<Post[]> {
  return posts.filter(post => post.userId === userId);
}

async function getCommentsByPostId(postId: number, comments: Comment[]): Promise<Comment[]> {
  return comments.filter(comment => comment.postId === postId);
}

async function main() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  const enrichedPosts = await enrichPostsWithUserDetails(posts, users);

  const userIdToFilter = 1;
  const postsForUser = await getPostsByUserId(userIdToFilter, enrichedPosts);

  console.log(`Posts for user ID ${userIdToFilter}:`, postsForUser);

  if (postsForUser.length > 0) {
    const firstPostId = postsForUser[0].id;
    const commentsForPost = await getCommentsByPostId(firstPostId, comments);
    console.log(`Comments for post ID ${firstPostId}:`, commentsForPost);
  } else {
    console.log(`No posts found for user ID ${userIdToFilter}.`);
  }
}

if (require.main === module) {
  main().catch(error => console.error("An error occurred:", error));
}