import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useNavigate } from 'react-router-dom';

const funnyOpeners = [
  "Welcome to UnderLiv — where passwords fear the spin cycle.",
  "Log in like a legend. Elastic optional.",
  "No socks were lost during this authentication.",
  "Your data is stored in... a very fancy drawer (localStorage).",
  "Enter the Hall. Mind the tumble dryer."
];

export default function Login() {
  const nav = useNavigate();
  const { user, login } = useLocalAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idx, setIdx] = useState(0);

  const opener = useMemo(() => funnyOpeners[idx % funnyOpeners.length], [idx]);

  useEffect(() => {
    const i = setInterval(() => setIdx((n) => n + 1), 3000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (user) nav('/');
  }, [user, nav]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
    nav('/');
  };

  const loginAsGuest = () => {
    login('Guest of the Laundry Realm');
    nav('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 gradient-hero">
      <Card className="w-full max-w-md p-8 shadow-fun animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-bounce-fun">
            <span className="text-3xl">🩲</span>
          </div>
          <h1 className="text-2xl font-bold">UnderLiv Login</h1>
          <p className="text-sm text-muted-foreground mt-1">{opener}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Laundry Legend" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hero@underliv.lol" />
          </div>

          <Button type="submit" className="w-full gradient-primary">Log Me In</Button>
          <Button type="button" variant="secondary" onClick={loginAsGuest} className="w-full">Login as Guest 🫧</Button>
          <p className="text-xs text-muted-foreground text-center">Super not secure. This is for demo giggles only.</p>
        </form>
      </Card>
    </div>
  );
}
