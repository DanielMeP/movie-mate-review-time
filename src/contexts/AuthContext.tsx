
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  partnerEmail?: string;
  partnerId?: string;
  partnerName?: string;
};

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  connectPartner: (partnerEmail: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Mock user database - in a real app, this would be a server API
const MOCK_USERS: User[] = [
  {
    id: "user1",
    name: "Alex",
    email: "alex@example.com",
    partnerId: "user2",
    partnerName: "Jordan",
    partnerEmail: "jordan@example.com"
  },
  {
    id: "user2",
    name: "Jordan",
    email: "jordan@example.com",
    partnerId: "user1",
    partnerName: "Alex",
    partnerEmail: "alex@example.com"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication - in a real app, this would be an API call
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(user => user.email === email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // In a real app, we would create the user in the database
      const newUser: User = {
        id: `user${MOCK_USERS.length + 1}`,
        name,
        email
      };
      
      // For demo, we'll just log the new user
      console.log('New user registered:', newUser);
      
      // In a real app, this would be saved to a database
      toast.success('Registration successful. Please log in.');
    } catch (error) {
      toast.error('Registration failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out');
  };

  const connectPartner = async (partnerEmail: string) => {
    setLoading(true);
    try {
      if (!currentUser) throw new Error('You must be logged in');
      
      // In a real app, this would send an invitation and connect after acceptance
      const partnerUser = MOCK_USERS.find(user => user.email === partnerEmail);
      
      if (!partnerUser) {
        throw new Error('User not found with that email');
      }

      // Update current user with partner info
      const updatedUser = {
        ...currentUser,
        partnerId: partnerUser.id,
        partnerName: partnerUser.name,
        partnerEmail: partnerUser.email
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success(`Connected with ${partnerUser.name}!`);
    } catch (error) {
      toast.error('Failed to connect: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    connectPartner
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
