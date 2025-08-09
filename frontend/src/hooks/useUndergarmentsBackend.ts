import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold';
  unlockedAt: string;
}

export interface Undergarment {
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
  userId: string;
}

interface UseUndergarmentsReturn {
  undergarments: Undergarment[];
  loading: boolean;
  fetchUndergarments: () => Promise<void>;
  addUndergarment: (undergarment: Omit<Undergarment, 'id' | 'washCount' | 'retired' | 'achievements' | 'userId'>) => Promise<void>;
  washUndergarment: (id: string) => Promise<void>;
  retireUndergarment: (id: string) => Promise<void>;
  deleteUndergarment: (id: string) => Promise<void>;
}

// Helper function to check and unlock achievements
const checkAchievements = (undergarment: Undergarment): Achievement[] => {
  const achievements: Achievement[] = [];
  const now = new Date().toISOString();

  // Fresh Prince - 10 washes
  if (undergarment.washCount >= 10 && !undergarment.achievements.find(a => a.id === 'fresh-prince')) {
    achievements.push({
      id: 'fresh-prince',
      name: 'Fresh Prince',
      description: 'Washed 10 times - still looking royal!',
      icon: '👑',
      type: 'bronze',
      unlockedAt: now,
    });
  }

  // Clean Machine - 25 washes
  if (undergarment.washCount >= 25 && !undergarment.achievements.find(a => a.id === 'clean-machine')) {
    achievements.push({
      id: 'clean-machine',
      name: 'Clean Machine',
      description: 'Reached 25 washes - squeaky clean champion!',
      icon: '🧽',
      type: 'silver',
      unlockedAt: now,
    });
  }

  // Wash Warrior - 50 washes
  if (undergarment.washCount >= 50 && !undergarment.achievements.find(a => a.id === 'wash-warrior')) {
    achievements.push({
      id: 'wash-warrior',
      name: 'Wash Warrior',
      description: 'Survived 50 washes - legendary durability!',
      icon: '⚔️',
      type: 'gold',
      unlockedAt: now,
    });
  }

  return achievements;
};

export const useUndergarmentsBackend = (): UseUndergarmentsReturn => {
  const [undergarments, setUndergarments] = useState<Undergarment[]>([]);
  const [loading, setLoading] = useState(true);

  const getCurrentUserId = (): string | null => {
    const user = localStorage.getItem('pantheon_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  };

  const fetchUndergarments = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const userId = getCurrentUserId();
      if (!userId) {
        setUndergarments([]);
        return;
      }

      const stored = localStorage.getItem(`pantheon_undergarments_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setUndergarments(data);
      } else {
        setUndergarments([]);
      }
    } catch (error) {
      console.error('Error fetching undergarments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch undergarments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUndergarment = async (undergarmentData: Omit<Undergarment, 'id' | 'washCount' | 'retired' | 'achievements' | 'userId'>): Promise<void> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to add undergarments",
          variant: "destructive",
        });
        return;
      }

      const newUndergarment: Undergarment = {
        ...undergarmentData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        washCount: 0,
        retired: false,
        achievements: [],
        userId,
      };

      const updatedUndergarments = [...undergarments, newUndergarment];
      setUndergarments(updatedUndergarments);

      // Save to localStorage
      localStorage.setItem(`pantheon_undergarments_${userId}`, JSON.stringify(updatedUndergarments));

      toast({
        title: "Success",
        description: `${newUndergarment.name} has been added to your collection!`,
      });
    } catch (error) {
      console.error('Error adding undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to add undergarment",
        variant: "destructive",
      });
    }
  };

  const washUndergarment = async (id: string): Promise<void> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const updatedUndergarments = undergarments.map(undergarment => {
        if (undergarment.id === id) {
          const newWashCount = undergarment.washCount + 1;
          const newAchievements = [...undergarment.achievements, ...checkAchievements({ ...undergarment, washCount: newWashCount })];
          
          return {
            ...undergarment,
            washCount: newWashCount,
            achievements: newAchievements,
          };
        }
        return undergarment;
      });

      setUndergarments(updatedUndergarments);
      localStorage.setItem(`pantheon_undergarments_${userId}`, JSON.stringify(updatedUndergarments));

      // Check for new achievements
      const undergarment = updatedUndergarments.find(u => u.id === id);
      if (undergarment) {
        const newAchievements = checkAchievements(undergarment);
        if (newAchievements.length > 0) {
          toast({
            title: "Achievement Unlocked!",
            description: `${newAchievements[0].name}: ${newAchievements[0].description}`,
          });
        }
      }
    } catch (error) {
      console.error('Error washing undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to wash undergarment",
        variant: "destructive",
      });
    }
  };

  const retireUndergarment = async (id: string): Promise<void> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const updatedUndergarments = undergarments.map(undergarment => {
        if (undergarment.id === id) {
          return {
            ...undergarment,
            retired: true,
            retiredDate: new Date().toISOString(),
          };
        }
        return undergarment;
      });

      setUndergarments(updatedUndergarments);
      localStorage.setItem(`pantheon_undergarments_${userId}`, JSON.stringify(updatedUndergarments));

      toast({
        title: "Undergarment Retired",
        description: "Your undergarment has been retired with honor!",
      });
    } catch (error) {
      console.error('Error retiring undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to retire undergarment",
        variant: "destructive",
      });
    }
  };

  const deleteUndergarment = async (id: string): Promise<void> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const updatedUndergarments = undergarments.filter(undergarment => undergarment.id !== id);
      setUndergarments(updatedUndergarments);
      localStorage.setItem(`pantheon_undergarments_${userId}`, JSON.stringify(updatedUndergarments));

      toast({
        title: "Undergarment Deleted",
        description: "Undergarment has been removed from your collection",
      });
    } catch (error) {
      console.error('Error deleting undergarment:', error);
      toast({
        title: "Error",
        description: "Failed to delete undergarment",
        variant: "destructive",
      });
    }
  };

  // Fetch undergarments on mount
  useEffect(() => {
    fetchUndergarments();
  }, []);

  return {
    undergarments,
    loading,
    fetchUndergarments,
    addUndergarment,
    washUndergarment,
    retireUndergarment,
    deleteUndergarment,
  };
}; 