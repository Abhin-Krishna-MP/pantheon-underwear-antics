import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnderwearAvatar } from './UnderwearAvatar';
import { Underwear, MATERIAL_LIFESPANS } from '@/types/underwear';
import { Sparkles, Trash2, Award, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnderwearCardProps {
  underwear: Underwear;
  onWash: (id: string) => void;
  onRetire: (id: string) => void;
}

export function UnderwearCard({ underwear, onWash, onRetire }: UnderwearCardProps) {
  const { toast } = useToast();
  
  const maxWashes = underwear.material === 'custom'
    ? Math.max(1, underwear.customWashes || 100)
    : MATERIAL_LIFESPANS[underwear.material];
  const lifespanPercentage = Math.min((underwear.washCount / maxWashes) * 100, 100);
  
  const getLifespanColor = () => {
    if (lifespanPercentage < 25) return 'text-green-600';
    if (lifespanPercentage < 50) return 'text-yellow-600';
    if (lifespanPercentage < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLifespanText = () => {
    if (lifespanPercentage < 25) return 'Fresh as a daisy!';
    if (lifespanPercentage < 50) return 'Getting comfy';
    if (lifespanPercentage < 75) return 'Showing character';
    if (lifespanPercentage < 95) return 'Veteran status';
    return 'Living on borrowed time!';
  };

  const handleCheckStatus = () => {
    const daysSincePurchase = Math.floor(
      (Date.now() - new Date(underwear.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const vibes = [
      'Hero-in-training 🦸‍♂️',
      'Washer of destiny 🧼',
      'Elastic enthusiasm 🎪',
      'Laundry legend potential 🌟',
      'Mildly scared of spin cycle 😰',
      'Fabric warrior in the making ⚔️',
      'Comfort crusader 🛡️',
      'Durability detective 🔍'
    ];

    const accessoriesText = (underwear.accessories && underwear.accessories.length > 0)
      ? `rocking ${underwear.accessories.join(' & ')}`
      : 'naturally fabulous';

    const status = `Name: ${underwear.name} • Material: ${underwear.material} (${maxWashes} washes) • Age: ${daysSincePurchase} days old • Current washes: ${underwear.washCount}/${maxWashes} • This pair is ${accessoriesText}. Prognosis: ${vibes[Math.floor(Math.random()*vibes.length)]}. Rough life expectancy: about ${Math.round(maxWashes * 0.8)} heroic washes (give or take a sock).`;

    toast({ title: 'UnderLiv Prognosis 🔮', description: status });
  };

  const handleWash = () => {
    if (underwear.retired) return;
    
    onWash(underwear.id);
    
    const funnyMessages = [
      '🧼 Squeaky clean! Your undergarment feels refreshed!',
      '✨ Fresh and fabulous! Ready for another adventure!',
      '🫧 Bubble power activated! Cleanliness level: Legendary!',
      '🌟 Sparkling like a diamond in the... laundry basket!',
      '💎 Now 99.9% germ-free and 100% confident!'
    ];
    
    toast({
      title: funnyMessages[Math.floor(Math.random() * funnyMessages.length)],
      description: `Wash #${underwear.washCount + 1} complete!`,
    });
  };

  const handleRetire = () => {
    onRetire(underwear.id);
    
    const retirementMessages = [
      '👑 A noble retirement! They served with honor and dignity.',
      '🎖️ Medal of Honor awarded for outstanding service!',
      '🌅 Off to the great hamper in the sky. Rest in peace, brave soldier.',
      '📚 Their story will be told for generations. What a legend!',
      '🎪 The circus of life calls them to their final bow!'
    ];
    
    toast({
      title: 'Farewell, Dear Friend!',
      description: retirementMessages[Math.floor(Math.random() * retirementMessages.length)],
    });
  };

  const daysSincePurchase = Math.floor(
    (Date.now() - new Date(underwear.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={`gradient-card p-6 shadow-fun hover:shadow-glow transition-all duration-300 ${
      underwear.retired ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <UnderwearAvatar underwear={underwear} size="md" />
          <div>
            <h3 className="font-bold text-lg">{underwear.name}</h3>
            <p className="text-sm text-muted-foreground">
              {underwear.material} • {daysSincePurchase} days old
            </p>
          </div>
        </div>
        
        {underwear.achievements.length > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            {underwear.achievements.length}
          </Badge>
        )}
      </div>

      {/* Lifespan Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Lifespan</span>
          <span className={`text-sm font-bold ${getLifespanColor()}`}>
            {lifespanPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              lifespanPercentage < 25 ? 'bg-green-500' :
              lifespanPercentage < 50 ? 'bg-yellow-500' :
              lifespanPercentage < 75 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(lifespanPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{getLifespanText()}</p>
      </div>

      {/* Wash Counter */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Wash Count</span>
          <span className="text-xl font-bold text-primary">
            {underwear.washCount}/{maxWashes}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!underwear.retired ? (
          <>
            <Button
              onClick={handleWash}
              className="flex-1 gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={lifespanPercentage >= 100}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Wash Me!
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRetire}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Badge variant="secondary" className="w-full justify-center py-2">
            Retired on {new Date(underwear.retiredDate!).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Check Status Button */}
      <div className="mt-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCheckStatus}
          className="w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          Check Status 🔮
        </Button>
      </div>
    </Card>
  );
}