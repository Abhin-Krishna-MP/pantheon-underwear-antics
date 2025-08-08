import { useState, useEffect } from 'react';
import { Underwear, Achievement, ACHIEVEMENTS_DATA } from '@/types/underwear';

const STORAGE_KEY = 'pantheon-underwear';

export function useUnderwear() {
  const [underwear, setUnderwear] = useState<Underwear[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUnderwear(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load underwear data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever underwear changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(underwear));
  }, [underwear]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const checkForNewAchievements = (underwear: Underwear): Achievement[] => {
    const existingAchievementIds = underwear.achievements.map(a => a.id);
    const newAchievements: Achievement[] = [];

    for (const achievementData of ACHIEVEMENTS_DATA) {
      if (
        !existingAchievementIds.includes(achievementData.id) &&
        underwear.washCount >= achievementData.requiredWashes
      ) {
        newAchievements.push({
          id: achievementData.id,
          name: achievementData.name,
          description: achievementData.description,
          icon: achievementData.icon,
          type: achievementData.type,
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    return newAchievements;
  };

  const addUnderwear = (newUnderwear: Omit<Underwear, 'id' | 'washCount' | 'retired' | 'achievements'>) => {
    const underwearWithDefaults: Underwear = {
      ...newUnderwear,
      id: generateId(),
      washCount: 0,
      retired: false,
      achievements: [],
    };

    setUnderwear(prev => [...prev, underwearWithDefaults]);
    return underwearWithDefaults;
  };

  const washUnderwear = (id: string) => {
    setUnderwear(prev => prev.map(u => {
      if (u.id !== id || u.retired) return u;

      const updated = { ...u, washCount: u.washCount + 1 };
      const newAchievements = checkForNewAchievements(updated);
      
      return {
        ...updated,
        achievements: [...u.achievements, ...newAchievements],
      };
    }));
  };

  const retireUnderwear = (id: string) => {
    setUnderwear(prev => prev.map(u => {
      if (u.id !== id) return u;
      return {
        ...u,
        retired: true,
        retiredDate: new Date().toISOString(),
      };
    }));
  };

  const deleteUnderwear = (id: string) => {
    setUnderwear(prev => prev.filter(u => u.id !== id));
  };

  return {
    underwear,
    addUnderwear,
    washUnderwear,
    retireUnderwear,
    deleteUnderwear,
  };
}