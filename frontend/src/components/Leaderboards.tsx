import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnderwearAvatar } from './UnderwearAvatar';
import { Underwear, MATERIAL_LIFESPANS } from '@/types/underwear';
import { Trophy, Award, Timer, TrendingUp, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useLeaderboard, LeaderboardUndergarment } from '@/hooks/useLeaderboard';

export function Leaderboards() {
  const { leaderboardData, loading } = useLeaderboard();
  
  // Transform leaderboard data to match the expected format
  const underwear: Underwear[] = leaderboardData.map(item => ({
    id: item.id,
    name: item.name,
    color: item.color,
    material: item.material,
    customWashes: item.customWashes,
    accessories: item.accessories,
    purchaseDate: item.purchaseDate,
    washCount: item.washCount,
    retired: item.retired,
    retiredDate: item.retiredDate,
    achievements: item.achievements
  }));
  const activeUnderwear = underwear.filter(u => !u.retired);

  const { mostWashed, longestLifespan, leastWashed, bestRatio } = useMemo(() => {
    const mostWashed = [...underwear]
      .sort((a, b) => b.washCount - a.washCount)
      .slice(0, 5);

    const longestLifespan = [...activeUnderwear]
      .map(u => ({
        ...u,
        lifespanDays: Math.floor((Date.now() - new Date(u.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => b.lifespanDays - a.lifespanDays)
      .slice(0, 5);

    const leastWashed = [...activeUnderwear]
      .filter(u => u.washCount > 0)
      .sort((a, b) => a.washCount - b.washCount)
      .slice(0, 5);

    const bestRatio = [...activeUnderwear]
      .map(u => {
        const maxWashes = u.material === 'custom' ? (u.customWashes || 100) : MATERIAL_LIFESPANS[u.material];
        const efficiency = u.washCount / maxWashes;
        return { ...u, efficiency };
      })
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5);

    return { mostWashed, longestLifespan, leastWashed, bestRatio };
  }, [underwear]);

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
            No contestants yet! Add some undergarment to see the competition heat up! 🔥
          </p>
        ) : (
          items.map((item, index) => {
            // Find the corresponding leaderboard item to get user info
            const leaderboardItem = leaderboardData.find(lbItem => lbItem.id === item.id);
            const username = leaderboardItem?.user?.username || 'Unknown User';
            
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getRankEmoji(index)}</span>
                  <UnderwearAvatar underwear={item} size="sm" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      by <span className="font-semibold text-primary">{username}</span> • {getLabel(item)}
                    </p>
                  </div>
                </div>
                <Badge variant={index === 0 ? 'default' : 'secondary'} className="font-bold">
                  {getValue(item)}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading leaderboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          🏆 Global Leaderboards 🏆
        </h2>
        <p className="text-muted-foreground">
          Where legends are made and elastic rises to glory across all users!
        </p>
      </div>

      <Tabs defaultValue="most-washed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="most-washed">Most Washed</TabsTrigger>
          <TabsTrigger value="longest-lived">Longest Lived</TabsTrigger>
          <TabsTrigger value="least-washed">Least Washed</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>



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