// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string; // Store only the hash
}

const UserAuth = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState<User[]>([]); // In-memory user storage (replace with DB)
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setIsLoggedIn(true);
            navigate('/dashboard'); // Redirect to dashboard if logged in
        }
    }, [navigate]);

    const registerUser = async () => {
        try {
            if (!username || !email || !password) {
                throw new Error("All fields are required for registration.");
            }

            // Basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw new Error("Invalid email format.");
            }

            // Password complexity requirements (example)
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long.");
            }

            // Hash the password (replace with a secure hashing library like bcrypt)
            const passwordHash = await hashPassword(password);

            const newUser: User = {
                id: uuidv4(),
                username,
                email,
                passwordHash,
            };

            setUsers([...users, newUser]); // Update in-memory storage
            localStorage.setItem('user', JSON.stringify(newUser)); // Store user in local storage
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
            console.error("Registration error:", err);
        }
    };

    const loginUser = async () => {
        try {
            if (!email || !password) {
                throw new Error("Email and password are required for login.");
            }

            const user = users.find((u) => u.email === email);

            if (!user) {
                throw new Error("Invalid email or password.");
            }

            // Verify the password (replace with secure comparison)
            const passwordMatch = await verifyPassword(password, user.passwordHash);

            if (!passwordMatch) {
                throw new Error("Invalid email or password.");
            }

            localStorage.setItem('user', JSON.stringify(user));
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
            console.error("Login error:", err);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    // Placeholder for password hashing (replace with bcrypt or similar)
    const hashPassword = async (password: string): Promise<string> => {
        // In a real application, use bcrypt or scrypt for secure hashing.
        // This is just a placeholder for demonstration purposes.
        return password; // DO NOT USE THIS IN PRODUCTION
    };

    // Placeholder for password verification (replace with bcrypt or similar)
    const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
        // In a real application, use bcrypt or scrypt for secure comparison.
        // This is just a placeholder for demonstration purposes.
        return password === hash; // DO NOT USE THIS IN PRODUCTION
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {!isLoggedIn ? (
                <div>
                    <h2>Register</h2>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={registerUser}>Register</button>

                    <h2>Login</h2>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={loginUser}>Login</button>
                </div>
            ) : (
                <div>
                    <h2>Welcome!</h2>
                    <button onClick={logoutUser}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default UserAuth;