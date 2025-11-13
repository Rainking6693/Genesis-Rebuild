// src/components/UserAuth.tsx
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory user store (replace with database in production)

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Replace with a strong, environment-based secret

async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error: any) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password.");
  }
}

async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error: any) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password.");
  }
}

export async function registerUser(username: string, password: string): Promise<string> {
  try {
    if (users.find(user => user.username === username)) {
      throw new Error("Username already exists.");
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: String(users.length + 1), // Simple ID generation for in-memory store
      username,
      passwordHash,
    };
    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;

  } catch (error: any) {
    console.error("Error registering user:", error);
    throw new Error(error.message || "Registration failed.");
  }
}

export async function loginUser(username: string, password: string): Promise<string> {
  try {
    const user = users.find(user => user.username === username);
    if (!user) {
      throw new Error("Invalid username or password.");
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error("Invalid username or password.");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;

  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw new Error(error.message || "Login failed.");
  }
}

export function logoutUser(): void {
  // In a real application, you might invalidate the JWT on the server-side or clear client-side session data.
  console.log("User logged out.");
}

export function verifyToken(token: string): any {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error: any) {
        console.error("Error verifying token:", error);
        return null; // Or throw an error, depending on your needs
    }
}

// Example usage (replace with your actual UI/API integration)
// registerUser("testuser", "password123").then(token => console.log("Registration token:", token));
// loginUser("testuser", "password123").then(token => console.log("Login token:", token));
// logoutUser();

// src/components/UserAuth.tsx
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory user store (replace with database in production)

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Replace with a strong, environment-based secret

async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error: any) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password.");
  }
}

async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error: any) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password.");
  }
}

export async function registerUser(username: string, password: string): Promise<string> {
  try {
    if (users.find(user => user.username === username)) {
      throw new Error("Username already exists.");
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: String(users.length + 1), // Simple ID generation for in-memory store
      username,
      passwordHash,
    };
    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;

  } catch (error: any) {
    console.error("Error registering user:", error);
    throw new Error(error.message || "Registration failed.");
  }
}

export async function loginUser(username: string, password: string): Promise<string> {
  try {
    const user = users.find(user => user.username === username);
    if (!user) {
      throw new Error("Invalid username or password.");
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error("Invalid username or password.");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;

  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw new Error(error.message || "Login failed.");
  }
}

export function logoutUser(): void {
  // In a real application, you might invalidate the JWT on the server-side or clear client-side session data.
  console.log("User logged out.");
}

export function verifyToken(token: string): any {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error: any) {
        console.error("Error verifying token:", error);
        return null; // Or throw an error, depending on your needs
    }
}

// Example usage (replace with your actual UI/API integration)
// registerUser("testuser", "password123").then(token => console.log("Registration token:", token));
// loginUser("testuser", "password123").then(token => console.log("Login token:", token));
// logoutUser();