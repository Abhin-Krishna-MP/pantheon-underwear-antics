export interface Underwear {
  id: string;
  name: string;
  color: string;
  material: 'cotton' | 'blend' | 'synthetic';
  purchaseDate: string;
  washCount: number;
  retired: boolean;
  retiredDate?: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'legendary';
  unlockedAt: string;
}

export const MATERIAL_LIFESPANS = {
  cotton: 60,
  blend: 80,
  synthetic: 100,
} as const;

export const ACHIEVEMENTS_DATA = [
  {
    id: 'fresh-prince',
    name: 'Fresh Prince',
    description: 'Washed 10 times - still looking royal!',
    icon: '👑',
    type: 'bronze' as const,
    requiredWashes: 10,
  },
  {
    id: 'clean-machine',
    name: 'Clean Machine',
    description: 'Reached 25 washes - squeaky clean champion!',
    icon: '🧽',
    type: 'silver' as const,
    requiredWashes: 25,
  },
  {
    id: 'wash-warrior',
    name: 'Wash Warrior',
    description: 'Survived 50 washes - legendary durability!',
    icon: '⚔️',
    type: 'gold' as const,
    requiredWashes: 50,
  },
  {
    id: 'immortal-briefs',
    name: 'Immortal Briefs',
    description: 'Over 75 washes and still going strong!',
    icon: '💎',
    type: 'legendary' as const,
    requiredWashes: 75,
  },
] as const;