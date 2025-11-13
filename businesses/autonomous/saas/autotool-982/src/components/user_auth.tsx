// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
    user: any | null; // Replace 'any' with your user type
    login: (userData: any) => void; // Replace 'any' with your user type
    logout: () => void;
    register: (userData: any) => void; // Replace 'any' with your user type
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null); // Replace 'any' with your user type

    const login = (userData: any) => { // Replace 'any' with your user type
        try {
            // Simulate API call for login
            // In a real application, you would make an API request here
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            console.error("Login failed:", error.message);
            // Handle login error (e.g., display an error message to the user)
            throw new Error("Login failed");
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
        } catch (error: any) {
            console.error("Logout failed:", error.message);
            // Handle logout error
            throw new Error("Logout failed");
        }
    };

    const register = async (userData: any) => { // Replace 'any' with your user type
        try {
            // Simulate API call for registration
            // In a real application, you would make an API request here
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            console.error("Registration failed:", error.message);
            // Handle registration error
            throw new Error("Registration failed");
        }
    };

    const value: AuthContextProps = {
        user,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Example Usage (can be moved to a separate component)
const LoginButton: React.FC = () => {
    const { login } = useAuth();

    const handleLogin = () => {
        // Simulate user data
        const userData = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
        };
        login(userData);
    };

    return <button onClick={handleLogin}>Login</button>;
};

export default LoginButton;