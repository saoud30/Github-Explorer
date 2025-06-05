import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchGitHubUser } from '../services/githubService';

interface User {
  id: number;
  login: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  name: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (username: string) => Promise<void>;
  recentUsers: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  // Load recent users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('recentUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setRecentUsers(parsedUsers);
      } catch (err) {
        console.error('Failed to parse recent users from localStorage', err);
      }
    }
  }, []);

  const fetchUser = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await fetchGitHubUser(username);
      setUser(userData);
      
      // Add to recent users (avoid duplicates and limit to 10)
      setRecentUsers(prevUsers => {
        const filteredUsers = prevUsers.filter(u => u.login !== userData.login);
        const updatedUsers = [userData, ...filteredUsers].slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('recentUsers', JSON.stringify(updatedUsers));
        
        return updatedUsers;
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser, recentUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};