// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string) => Promise<void>;
    user: string | null;
}

export const AuthContext = React.createContext<AuthContextProps>({
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    user: null
});

export const AuthProvider: React.FC = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            if (username === 'user' && password === 'password') {
                setIsAuthenticated(true);
                setUser(username);
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error: any) {
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message); // Basic error handling for demo
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const register = async (username: string, password: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real application, you'd send the username and password to a server
            console.log(`Registered user: ${username}`);
            alert(`Registered user: ${username}`); // Basic feedback
        } catch (error: any) {
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        }
    };

    const value: AuthContextProps = {
        isAuthenticated,
        login,
        logout,
        register,
        user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);

// Example usage (in a component):
// const { isAuthenticated, login, logout } = useAuth();
// if (isAuthenticated) { ... } else { ... }

// Error Boundary (basic example - consider a more robust implementation)
export class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

// Total: ~120 lines of TypeScript