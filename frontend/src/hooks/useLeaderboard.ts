import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

import { API_BASE_URL } from '@/config/api';

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
    id: number;
    username: string;
    email?: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  unlockedAt: string;
}

export function useLeaderboard() {
  const { toast } = useToast();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUndergarment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard/`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform backend data to match frontend format
        const transformedData = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          color: item.color,
          material: item.material,
          customWashes: item.custom_washes,
          accessories: item.accessories || [],
          purchaseDate: item.purchase_date,
          washCount: item.wash_count,
          retired: item.retired,
          retiredDate: item.retired_date,
          achievements: item.achievements || [],
          user: item.user
        }));
        setLeaderboardData(transformedData);
      } else {
        console.error('Failed to fetch leaderboard');
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboardData,
    loading,
    refreshData: fetchLeaderboard,
  };
} 