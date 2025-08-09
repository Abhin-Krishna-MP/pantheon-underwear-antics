import { useState, useEffect } from 'react';

export interface LeaderboardUndergarment {
  id: string;
  name: string;
  color: string;
  material: string;
  customWashes: number;
  accessories: string[];
  purchaseDate: string;
  washCount: number;
  retired: boolean;
  retiredDate?: string;
  achievements: Achievement[];
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold';
  unlockedAt: string;
}

interface UseLeaderboardReturn {
  leaderboardData: LeaderboardUndergarment[];
  loading: boolean;
  fetchLeaderboard: () => Promise<void>;
}

// Mock users for demonstration
const MOCK_USERS = [
  { id: '1', username: 'admin', email: 'admin@example.com' },
  { id: '2', username: 'user1', email: 'user1@example.com' },
  { id: '3', username: 'user2', email: 'user2@example.com' },
];

export const useLeaderboard = (): UseLeaderboardReturn => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUndergarment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const allUndergarments: LeaderboardUndergarment[] = [];

      // Collect undergarments from all users
      MOCK_USERS.forEach(user => {
        const stored = localStorage.getItem(`pantheon_undergarments_${user.id}`);
        if (stored) {
          try {
            const userUndergarments = JSON.parse(stored);
            const leaderboardItems = userUndergarments.map((undergarment: any) => ({
              ...undergarment,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
              },
            }));
            allUndergarments.push(...leaderboardItems);
          } catch (error) {
            console.error(`Error parsing undergarments for user ${user.id}:`, error);
          }
        }
      });

      // Sort by wash count (highest first)
      const sortedUndergarments = allUndergarments.sort((a, b) => b.washCount - a.washCount);
      
      setLeaderboardData(sortedUndergarments);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboardData,
    loading,
    fetchLeaderboard,
  };
}; 