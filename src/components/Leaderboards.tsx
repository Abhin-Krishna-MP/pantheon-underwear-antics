import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnderwearAvatar } from './UnderwearAvatar';
import { Underwear, MATERIAL_LIFESPANS } from '@/types/underwear';
import { Trophy, Award, Timer, TrendingUp } from 'lucide-react';

interface LeaderboardsProps {
  underwear: Underwear[];
}

export function Leaderboards({ underwear }: LeaderboardsProps) {
  const activeUnderwear = underwear.filter(u => !u.retired);

  // Greedy picks (single-pass) for the top one in each category
  const greedyMostWashed = underwear.reduce<Underwear | null>((best, u) => {
    if (!best || u.washCount > best.washCount) return u;
    return best;
  }, null);

  const greedyLongest = activeUnderwear.reduce<{ u: Underwear; days: number } | null>((best, u) => {
    const days = Math.floor((Date.now() - new Date(u.purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
    if (!best || days > best.days) return { u, days };
    return best;
  }, null);

  const greedyLeastWashed = activeUnderwear.reduce<Underwear | null>((best, u) => {
    if (u.washCount === 0) return best ?? u;
    if (!best || (best.washCount === 0) || u.washCount < best.washCount) return u;
    return best;
  }, null);

  const greedyBestEfficiency = activeUnderwear.reduce<{ u: Underwear; eff: number } | null>((best, u) => {
    const max = u.material === 'custom' ? (u.customWashes || 100) : MATERIAL_LIFESPANS[u.material];
    const eff = max ? u.washCount / max : 0;
    if (!best || eff > best.eff) return { u, eff };
    return best;
  }, null);

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏅';
  };

  const LeaderboardCard = ({ 
    title, 
    icon, 
    items, 
    getValue, 
    getLabel 
  }: {
    title: string;
    icon: React.ReactNode;
    items: any[];
    getValue: (item: any) => string | number;
    getLabel: (item: any) => string;
  }) => (
    <Card className="gradient-card p-6 shadow-fun">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No contestants yet! Add some underwear to see the competition heat up! 🔥
          </p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getRankEmoji(index)}</span>
                <UnderwearAvatar underwear={item} size="sm" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{getLabel(item)}</p>
                </div>
              </div>
              <Badge variant={index === 0 ? 'default' : 'secondary'} className="font-bold">
                {getValue(item)}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          🏆 Leaderboards 🏆
        </h2>
        <p className="text-muted-foreground">
          Where legends are made and elastic rises to glory!
        </p>
      </div>

      <Tabs defaultValue="most-washed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="most-washed">Most Washed</TabsTrigger>
          <TabsTrigger value="longest-lived">Longest Lived</TabsTrigger>
          <TabsTrigger value="least-washed">Least Washed</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        {/* Greedy champs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Greedy Pick</p>
            {greedyMostWashed ? (
              <div className="mt-2 flex items-center gap-2">
                <UnderwearAvatar underwear={greedyMostWashed} size="sm" />
                <span className="font-medium">{greedyMostWashed.name}</span>
                <Badge variant="secondary">{greedyMostWashed.washCount} washes</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Greedy Longest</p>
            {greedyLongest ? (
              <div className="mt-2 flex items-center gap-2">
                <UnderwearAvatar underwear={greedyLongest.u} size="sm" />
                <span className="font-medium">{greedyLongest.u.name}</span>
                <Badge variant="secondary">{greedyLongest.days} days</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Greedy Freshie</p>
            {greedyLeastWashed ? (
              <div className="mt-2 flex items-center gap-2">
                <UnderwearAvatar underwear={greedyLeastWashed} size="sm" />
                <span className="font-medium">{greedyLeastWashed.name}</span>
                <Badge variant="secondary">{greedyLeastWashed.washCount} washes</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Greedy Efficient</p>
            {greedyBestEfficiency ? (
              <div className="mt-2 flex items-center gap-2">
                <UnderwearAvatar underwear={greedyBestEfficiency.u} size="sm" />
                <span className="font-medium">{greedyBestEfficiency.u.name}</span>
                <Badge variant="secondary">{(greedyBestEfficiency.eff * 100).toFixed(0)}%</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">—</p>
            )}
          </Card>
        </div>

        <TabsContent value="most-washed">
          <LeaderboardCard
            title="Wash Champions"
            icon={<Trophy className="w-5 h-5 text-yellow-500" />}
            items={mostWashed}
            getValue={(item) => `${item.washCount} washes`}
            getLabel={(item) => item.retired ? 'Retired Legend' : 'Still Fighting'}
          />
        </TabsContent>

        <TabsContent value="longest-lived">
          <LeaderboardCard
            title="Veteran Warriors"
            icon={<Timer className="w-5 h-5 text-blue-500" />}
            items={longestLifespan}
            getValue={(item) => `${item.lifespanDays} days`}
            getLabel={(item) => `${item.material} | ${item.washCount} washes`}
          />
        </TabsContent>

        <TabsContent value="least-washed">
          <LeaderboardCard
            title="Fresh Faces"
            icon={<Award className="w-5 h-5 text-green-500" />}
            items={leastWashed}
            getValue={(item) => `${item.washCount} washes`}
            getLabel={(item) => 'Staying fresh!'}
          />
        </TabsContent>

        <TabsContent value="efficiency">
          <LeaderboardCard
            title="Efficiency Masters"
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            items={bestRatio}
            getValue={(item) => `${(item.efficiency * 100).toFixed(1)}%`}
            getLabel={(item) => `${item.washCount}/${MATERIAL_LIFESPANS[item.material] || item.customWashes} washes`}
          />
        </TabsContent>
      </Tabs>

      {/* Fun Stats */}
      <Card className="gradient-card p-6 shadow-fun">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          📊 Hall Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{underwear.length}</div>
            <div className="text-sm text-muted-foreground">Total Inductees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{activeUnderwear.length}</div>
            <div className="text-sm text-muted-foreground">Still Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {underwear.reduce((sum, u) => sum + u.washCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Washes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">
              {underwear.filter(u => u.retired).length}
            </div>
            <div className="text-sm text-muted-foreground">Retired Heroes</div>
          </div>
        </div>
      </Card>
    </div>
  );
}