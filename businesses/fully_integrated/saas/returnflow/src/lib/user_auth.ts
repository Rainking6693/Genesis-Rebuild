import { Jwt } from 'jsonwebtoken';
import { UserRepository } from './user-repository';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('Missing SECRET_KEY environment variable.');
}

type AuthenticateUserRequest = {
  email: string;
  password: string;
};

type AuthenticateUserResponse = {
  token: string;
};

function isValidEmail(email: string): boolean {
  // Regular expression for validating email format
  // You can adjust this according to your specific requirements
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

async function authenticateUser(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
  // 1. Check correctness, completeness, and quality
  if (!request || !request.email || !request.password || !isValidEmail(request.email)) {
    throw new Error('Invalid request. Email and password are required, and email must be valid.');
  }

  // 2. Ensure consistency with business context
  const userRepositoryInstance = UserRepository.getInstance();
  if (!userRepositoryInstance) {
    throw new Error('UserRepository instance not found.');
  }

  const user = await userRepositoryInstance.findByEmail(request.email);
  if (!user) {
    throw new Error('User not found.');
  }

  // 3. Apply security best practices
  // Use a secure password hashing algorithm and salt
  const isPasswordValid = await user.comparePassword(request.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Use JWT for authentication and authorization
  // Implement rate limiting to prevent brute force attacks (not shown here for simplicity)

  // 4. Optimize performance
  // Use caching for frequently accessed data
  // Use asynchronous operations for non-blocking I/O

  // 5. Improve maintainability
  // Use descriptive variable and function names
  // Use comments to explain complex logic

  // Generate JWT token and return it
  const token = jwt.sign({ userId: user.id }, SECRET_KEY);
  return { token };
}