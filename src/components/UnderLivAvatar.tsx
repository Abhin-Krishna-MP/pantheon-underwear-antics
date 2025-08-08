import { UnderLiv, MATERIAL_LIFESPANS } from '@/types/underwear';

interface UnderLivAvatarProps {
  underliv: UnderLiv;
  size?: 'sm' | 'md' | 'lg';
}

const getLifespanPercentage = (underliv: UnderLiv) => {
  const maxWashes = underliv.material === 'custom'
    ? Math.max(1, underliv.customWashes || 100)
    : MATERIAL_LIFESPANS[underliv.material];
  return (underliv.washCount / maxWashes) * 100;
};

const getAvatarGlow = (underliv: UnderLiv) => {
  if (underliv.retired) return 'avatar-glow-retired';
  
  const lifespan = getLifespanPercentage(underliv);
  if (lifespan >= 80) return 'avatar-glow-danger';
  if (lifespan >= 60) return 'avatar-glow-warning';
  if (lifespan >= 40) return 'avatar-glow-info';
  return 'avatar-glow-success';
};

const getAccessories = (underliv: UnderLiv) => {
  const lifespan = getLifespanPercentage(underliv);
  const accessories: string[] = [];
  
  // Add user-selected accessories
  underliv.accessories?.forEach((a) => accessories.push(a));
  
  // Add automatic accessories based on lifespan
  if (lifespan >= 80) accessories.push('sunglasses');
  if (lifespan >= 90) accessories.push('hat');
  
  // Add retired status
  if (underliv.retired) accessories.push('retired');
  
  return accessories;
};

export function UnderLivAvatar({ underliv, size = 'md' }: UnderLivAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const lifespan = getLifespanPercentage(underliv);
  const accessories = getAccessories(underliv);
  const glowClass = getAvatarGlow(underliv);

  return (
    <div className={`relative ${sizeClasses[size]} ${glowClass}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: underliv.retired ? 'grayscale(70%)' : 'none' }}
      >
        {/* Main underliv body */}
        <rect
          x="20"
          y="30"
          width="60"
          height="40"
          rx="8"
          fill={underliv.color}
          className="transition-all duration-300"
          opacity={underliv.retired ? 0.6 : 1}
        />
        
        {/* Elastic band */}
        <rect
          x="15"
          y="25"
          width="70"
          height="10"
          rx="5"
          fill={underliv.color}
          className="transition-all duration-300"
          opacity={underliv.retired ? 0.6 : 0.8}
        />
        
        {/* Leg holes */}
        <circle cx="30" cy="70" r="8" fill="none" stroke={underliv.color} strokeWidth="2" />
        <circle cx="70" cy="70" r="8" fill="none" stroke={underliv.color} strokeWidth="2" />
        
        {/* Lifespan indicator */}
        <rect
          x="20"
          y="75"
          width={60 * (lifespan / 100)}
          height="4"
          rx="2"
          fill={lifespan >= 80 ? '#ef4444' : lifespan >= 60 ? '#f59e0b' : lifespan >= 40 ? '#3b82f6' : '#10b981'}
          className="transition-all duration-300"
        />
        
        {/* Accessories */}
        {accessories.includes('sunglasses') && !underliv.retired && (
          <g>
            <rect x="25" y="35" width="15" height="8" rx="4" fill="#1f2937" />
            <rect x="60" y="35" width="15" height="8" rx="4" fill="#1f2937" />
            <line x1="40" y1="39" x2="60" y2="39" stroke="#1f2937" strokeWidth="2" />
          </g>
        )}
        
        {accessories.includes('hat') && !underliv.retired && (
          <g>
            <ellipse cx="50" cy="20" rx="25" ry="8" fill="#8b5cf6" />
            <rect x="40" y="20" width="20" height="8" fill="#8b5cf6" />
          </g>
        )}
        
        {/* Retired indicator */}
        {underliv.retired && (
          <g>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#6b7280" strokeWidth="3" strokeDasharray="5,5" />
            <text x="50" y="55" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="bold">
              RETIRED
            </text>
          </g>
        )}
        
        {/* Achievement badge */}
        {underliv.achievements.length > 0 && !underliv.retired && (
          <g>
            <circle cx="80" cy="20" r="12" fill="#fbbf24" />
            <text x="80" y="25" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">
              {underliv.achievements.length}
            </text>
          </g>
        )}
      </svg>
      
      {/* Floating accessories */}
      {accessories.includes('sunglasses') && !underliv.retired && (
        <div className="absolute -top-2 -right-2 text-lg animate-bounce">
          😎
        </div>
      )}
      
      {!underliv.retired && (
        <div className="absolute -bottom-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
          {underliv.washCount}
        </div>
      )}
    </div>
  );
}