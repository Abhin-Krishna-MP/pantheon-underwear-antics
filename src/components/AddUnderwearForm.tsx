import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Underwear } from '@/types/underwear';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface AddUnderwearFormProps {
  onAdd: (underwear: Omit<Underwear, 'id' | 'washCount' | 'retired' | 'achievements'>) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#FFB347', '#87CEEB', '#F0E68C', '#FA8072',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471'
];

export function AddUnderwearForm({ onAdd }: AddUnderwearFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    color: '#FF6B6B',
    material: 'cotton' as const,
    customWashes: 60,
    accessories: [] as ('sunglasses' | 'hat')[],
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

  onAdd(formData);
  
  // Reset form
  setFormData({
    name: '',
    color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
    material: 'cotton',
    customWashes: 60,
    accessories: [],
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  setIsOpen(false);
  };

  const generateRandomName = () => {
    const adjectives = [
      'Mighty', 'Brave', 'Royal', 'Golden', 'Super', 'Mega', 'Ultra',
      'Cosmic', 'Legendary', 'Epic', 'Fantastic', 'Magical', 'Wonder',
      'Champion', 'Supreme', 'Divine', 'Heroic', 'Majestic', 'Noble'
    ];
    
    const nouns = [
      'Briefs', 'Boxers', 'Trunks', 'Shorts', 'Bloomers', 'Undies',
      'Panties', 'Drawers', 'Skivvies', 'Intimates', 'Smalls',
      'Unmentionables', 'Delicates', 'Foundation', 'Support'
    ];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    setFormData(prev => ({ ...prev, name: `${adj} ${noun}` }));
  };

  if (!isOpen) {
    return (
      <Card className="gradient-card p-6 shadow-fun hover:shadow-glow transition-all duration-300 cursor-pointer border-dashed border-2 border-primary/30 hover:border-primary/60"
            onClick={() => setIsOpen(true)}>
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-bounce-fun">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Add New Underwear</h3>
          <p className="text-sm text-muted-foreground">
            Induct a new member into the Hall of Fame!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gradient-card p-6 shadow-fun">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">New Underwear Recruit</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="flex gap-2">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Thunder Briefs, Magic Boxers..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateRandomName}
              className="px-3"
            >
              🎲
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-10 h-10 rounded border-2 border-border cursor-pointer"
            />
            <div className="flex flex-wrap gap-1 flex-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border-2 border-white hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select
            value={formData.material}
            onValueChange={(value: any) => setFormData(prev => ({ ...prev, material: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cotton">Cotton (60 washes) - Classic comfort</SelectItem>
              <SelectItem value="blend">Blend (80 washes) - Best of both worlds</SelectItem>
              <SelectItem value="synthetic">Synthetic (100 washes) - Maximum durability</SelectItem>
              <SelectItem value="custom">Custom (you decide!)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.material === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="customWashes">Expected Lifespan (washes)</Label>
            <Input
              id="customWashes"
              type="number"
              min={1}
              value={formData.customWashes}
              onChange={(e) => setFormData(prev => ({ ...prev, customWashes: Number(e.target.value || 1) }))}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Accessories</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={formData.accessories.includes('sunglasses')}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({
                    ...prev,
                    accessories: checked
                      ? Array.from(new Set([...(prev.accessories || []), 'sunglasses']))
                      : (prev.accessories || []).filter(a => a !== 'sunglasses')
                  }))
                }
              />
              Sunglasses 😎
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={formData.accessories.includes('hat')}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({
                    ...prev,
                    accessories: checked
                      ? Array.from(new Set([...(prev.accessories || []), 'hat']))
                      : (prev.accessories || []).filter(a => a !== 'hat')
                  }))
                }
              />
              Hat 🎩
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={() => handleCheckStatus()}>
            Check Status 🔮
          </Button>
          <Button type="submit" className="flex-1 gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Welcome to UnderLiv!
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}