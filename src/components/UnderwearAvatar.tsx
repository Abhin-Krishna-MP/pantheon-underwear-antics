import { Underwear } from '@/types/underwear';

interface UnderwearAvatarProps {
  underwear: Underwear;
  size?: 'sm' | 'md' | 'lg';
}

const getLifespanPercentage = (underwear: Underwear) => {
  const maxWashes = underwear.material === 'cotton' ? 60 : 
                   underwear.material === 'blend' ? 80 : 100;
  return (underwear.washCount / maxWashes) * 100;
};

const getAvatarGlow = (underwear: Underwear) => {
  if (underwear.retired) return 'avatar-glow-retired';
  
  const lifespan = getLifespanPercentage(underwear);
  if (lifespan < 25) return 'avatar-glow-new';
  if (lifespan < 75) return 'avatar-glow-used';
  return 'avatar-glow-worn';
};

const getAccessories = (underwear: Underwear) => {
  const lifespan = getLifespanPercentage(underwear);
  const accessories = [];
  
  // Add wear indicators based on lifespan
  if (lifespan > 25) accessories.push('holes');
  if (lifespan > 50) accessories.push('patches');
  if (lifespan > 75) accessories.push('threads');
  if (underwear.retired) accessories.push('retired');
  
  return accessories;
};

export function UnderwearAvatar({ underwear, size = 'md' }: UnderwearAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const lifespan = getLifespanPercentage(underwear);
  const accessories = getAccessories(underwear);
  const glowClass = getAvatarGlow(underwear);

  return (
    <div className={`${sizeClasses[size]} ${glowClass} transition-all duration-300`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-float"
        style={{ filter: underwear.retired ? 'grayscale(70%)' : 'none' }}
      >
        {/* Main underwear body */}
        <path
          d="M20 30 Q50 20 80 30 L85 70 Q50 80 15 70 Z"
          fill={underwear.color}
          stroke="#333"
          strokeWidth="2"
          opacity={underwear.retired ? 0.6 : 1}
        />
        
        {/* Waistband */}
        <rect
          x="20"
          y="25"
          width="60"
          height="8"
          fill={underwear.color}
          stroke="#333"
          strokeWidth="1"
          opacity={underwear.retired ? 0.6 : 0.8}
        />
        
        {/* Brand label */}
        <rect
          x="45"
          y="27"
          width="10"
          height="4"
          fill="white"
          opacity="0.8"
        />
        
        {/* Wear indicators based on lifespan */}
        {accessories.includes('holes') && (
          <>
            <circle cx="35" cy="45" r="2" fill="none" stroke="#666" strokeWidth="1"/>
            <circle cx="65" cy="55" r="1.5" fill="none" stroke="#666" strokeWidth="1"/>
          </>
        )}
        
        {accessories.includes('patches') && (
          <rect
            x="55"
            y="40"
            width="8"
            height="6"
            fill="#ddd"
            stroke="#999"
            strokeWidth="1"
            opacity="0.7"
          />
        )}
        
        {accessories.includes('threads') && (
          <>
            <path
              d="M25 50 Q30 45 35 50"
              stroke="#999"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M70 60 Q75 55 80 60"
              stroke="#999"
              strokeWidth="1"
              fill="none"
            />
          </>
        )}
        
        {/* Retired indicator */}
        {underwear.retired && (
          <g>
            <circle cx="50" cy="50" r="15" fill="rgba(0,0,0,0.1)"/>
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fontSize="12"
              fill="#666"
              fontWeight="bold"
            >
              RIP
            </text>
          </g>
        )}
        
        {/* Achievement indicators */}
        {underwear.achievements.length > 0 && !underwear.retired && (
          <g>
            <circle cx="75" cy="35" r="8" fill="#ffd700" stroke="#ff8c00" strokeWidth="1"/>
            <text x="75" y="38" textAnchor="middle" fontSize="10">
              {underwear.achievements.length}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}