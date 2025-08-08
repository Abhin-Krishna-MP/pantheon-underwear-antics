import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnderLivAvatar } from './UnderLivAvatar';
import { UnderLiv, MATERIAL_LIFESPANS } from '@/types/underwear';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Trash2 } from 'lucide-react';

interface UnderLivCardProps {
  underliv: UnderLiv;
  onWash: (id: string) => void;
  onRetire: (id: string) => void;
}

export function UnderLivCard({ underliv, onWash, onRetire }: UnderLivCardProps) {
  const { toast } = useToast();

  const maxWashes = underliv.material === 'custom'
    ? Math.max(1, underliv.customWashes || 100)
    : MATERIAL_LIFESPANS[underliv.material];
  const lifespanPercentage = Math.min((underliv.washCount / maxWashes) * 100, 100);

  const handleWash = () => {
    if (underliv.retired) return;
    
    onWash(underliv.id);
    
    toast({
      title: '🧼 Squeaky clean! Your underliv feels refreshed!',
      description: `Wash #${underliv.washCount + 1} complete!`,
      duration: 3000,
    });
  };

  const handleRetire = () => {
    onRetire(underliv.id);
    
    toast({
      title: '🌅 A hero retires',
      description: `${underliv.name} has been honorably discharged from active duty.`,
      duration: 4000,
    });
  };

  const daysSincePurchase = Math.floor(
    (Date.now() - new Date(underliv.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={`gradient-card p-6 shadow-fun hover:shadow-glow transition-all duration-300 ${underliv.retired ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        <UnderLivAvatar underliv={underliv} size="md" />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg">{underliv.name}</h3>
          <p className="text-sm text-muted-foreground">
            {underliv.material} • {daysSincePurchase} days old
          </p>
          
          {underliv.achievements.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{underliv.achievements.length} achievements</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* Lifespan Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Lifespan</span>
            <span className="font-medium">{underliv.washCount}/{maxWashes}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                lifespanPercentage >= 80 ? 'bg-destructive' :
                lifespanPercentage >= 60 ? 'bg-warning' :
                lifespanPercentage >= 40 ? 'bg-info' : 'bg-success'
              }`}
              style={{ width: `${lifespanPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {!underliv.retired ? (
          <div className="flex gap-2">
            <Button
              onClick={handleWash}
              className="flex-1 gradient-primary"
              disabled={underliv.retired}
            >
              🧼 Wash
            </Button>
            <Button
              onClick={handleRetire}
              variant="outline"
              className="flex-1"
            >
              🌅 Retire
            </Button>
          </div>
        ) : (
          <div className="text-center py-2">
            <Badge variant="secondary" className="text-xs">
              Retired on {new Date(underliv.retiredDate!).toLocaleDateString()}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}