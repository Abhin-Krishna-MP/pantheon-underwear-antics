import { useState, useEffect } from 'react';
import { UnderLiv, Achievement, ACHIEVEMENTS_DATA } from '@/types/underwear';

const STORAGE_KEY = 'pantheon-underliv';

export function useUnderLiv() {
  const [underliv, setUnderLiv] = useState<UnderLiv[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUnderLiv(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load underliv data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever underliv changes
  useEffect(() => {
    if (underliv.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(underliv));
    }
  }, [underliv]);

  const checkForNewAchievements = (underliv: UnderLiv): Achievement[] => {
    const existingAchievementIds = underliv.achievements.map(a => a.id);
    const newAchievements: Achievement[] = [];

    ACHIEVEMENTS_DATA.forEach(achievementData => {
      if (!existingAchievementIds.includes(achievementData.id) &&
          underliv.washCount >= achievementData.requiredWashes) {
        newAchievements.push({
          ...achievementData,
          unlockedAt: new Date().toISOString(),
        });
      }
    });

    return newAchievements;
  };

  const addUnderLiv = (newUnderLiv: Omit<UnderLiv, 'id' | 'washCount' | 'retired' | 'achievements'>) => {
    const underlivWithDefaults: UnderLiv = {
      ...newUnderLiv,
      id: crypto.randomUUID(),
      washCount: 0,
      retired: false,
      achievements: [],
    };

    setUnderLiv(prev => [...prev, underlivWithDefaults]);
    return underlivWithDefaults;
  };

  const washUnderLiv = (id: string) => {
    setUnderLiv(prev => prev.map(u => {
      if (u.id === id) {
        const newWashCount = u.washCount + 1;
        const newAchievements = checkForNewAchievements({ ...u, washCount: newWashCount });
        
        return {
          ...u,
          washCount: newWashCount,
          achievements: [...u.achievements, ...newAchievements],
        };
      }
      return u;
    }));
  };

  const retireUnderLiv = (id: string) => {
    setUnderLiv(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          retired: true,
          retiredDate: new Date().toISOString(),
        };
      }
      return u;
    }));
  };

  const deleteUnderLiv = (id: string) => {
    setUnderLiv(prev => prev.filter(u => u.id !== id));
  };

  return {
    underliv,
    addUnderLiv,
    washUnderLiv,
    retireUnderLiv,
    deleteUnderLiv,
  };
}