import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnderwearCard } from '@/components/UnderwearCard';
import { AddUnderwearForm } from '@/components/AddUnderwearForm';
import { Leaderboards } from '@/components/Leaderboards';
import { useUnderwear } from '@/hooks/useUnderwear';
import { Crown, Plus, Trophy, Sparkles } from 'lucide-react';

const Index = () => {
  const { underwear, addUnderwear, washUnderwear, retireUnderwear } = useUnderwear();
  const [activeTab, setActiveTab] = useState('hall');

  const activeUnderwear = underwear.filter(u => !u.retired);
  const retiredUnderwear = underwear.filter(u => u.retired);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow animate-pulse-glow">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold rainbow-text">
                  Pantheon: The Hall of Famous Underwear
                </h1>
                <p className="text-sm text-muted-foreground">
                  Where cotton dreams come true and briefs become legends! 👑
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Inductees</div>
              <div className="text-2xl font-bold text-primary">{underwear.length}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="hall" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Hall of Fame ({activeUnderwear.length})
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="retired" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Retired Heroes ({retiredUnderwear.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hall" className="space-y-6">
            {/* Welcome Message */}
            {underwear.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-fun shadow-glow">
                  <Crown className="w-12 h-12 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Welcome to the Pantheon!</h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                  Your underwear drawer awaits its first legendary inductee. 
                  Add your first pair and begin the epic journey! 🩲✨
                </p>
              </div>
            )}

            {/* Underwear Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AddUnderwearForm onAdd={addUnderwear} />
              
              {activeUnderwear.map((item) => (
                <UnderwearCard
                  key={item.id}
                  underwear={item}
                  onWash={washUnderwear}
                  onRetire={retireUnderwear}
                />
              ))}
            </div>

            {/* Quick Stats */}
            {underwear.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="gradient-card p-4 rounded-xl text-center shadow-fun">
                  <div className="text-2xl font-bold text-primary">
                    {underwear.reduce((sum, u) => sum + u.washCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Washes</div>
                </div>
                
                <div className="gradient-card p-4 rounded-xl text-center shadow-fun">
                  <div className="text-2xl font-bold text-secondary">
                    {underwear.reduce((sum, u) => sum + u.achievements.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                
                <div className="gradient-card p-4 rounded-xl text-center shadow-fun">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round(underwear.reduce((sum, u) => {
                      const days = Math.floor((Date.now() - new Date(u.purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
                      return sum + days;
                    }, 0) / underwear.length) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Age (days)</div>
                </div>
                
                <div className="gradient-card p-4 rounded-xl text-center shadow-fun">
                  <div className="text-2xl font-bold text-destructive">
                    {retiredUnderwear.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Retired</div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboards">
            <Leaderboards underwear={underwear} />
          </TabsContent>

          <TabsContent value="retired" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                🌅 Retired Heroes 🌅
              </h2>
              <p className="text-muted-foreground">
                Honoring those who served with distinction and dignity
              </p>
            </div>

            {retiredUnderwear.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No retired heroes yet. Your underwear must be made of steel! 💪
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {retiredUnderwear.map((item) => (
                  <UnderwearCard
                    key={item.id}
                    underwear={item}
                    onWash={washUnderwear}
                    onRetire={retireUnderwear}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Made with 💜 for all the underwear that deserves recognition.
            <br />
            Remember: every pair has a story, and every wash counts! 🧼✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;