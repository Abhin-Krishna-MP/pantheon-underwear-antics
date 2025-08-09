import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const funnyOpeners = [
  "Welcome to UnderLiv — where passwords fear the spin cycle.",
  "Log in like a legend. Elastic optional.",
  "No socks were lost during this authentication.",
  "Your data is stored in... a very fancy drawer (Django).",
  "Enter the Hall. Mind the tumble dryer."
];

export default function Login() {
  const nav = useNavigate();
  const { user, isAuthenticated, isLoading, login, register } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [idx, setIdx] = useState(0);

  const opener = useMemo(() => funnyOpeners[idx % funnyOpeners.length], [idx]);

  useEffect(() => {
    const i = setInterval(() => setIdx((n) => n + 1), 3000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) nav('/');
  }, [isAuthenticated, isLoading, nav]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form submission already in progress, ignoring');
      return;
    }
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isRegistering && !email.trim()) {
      toast({
        title: "Error",
        description: "Email is required for registration",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting form with:', { username, isRegistering });

    try {
      const success = isRegistering 
        ? await register(username, email, password)
        : await login(username, password);

      if (success) {
        nav('/');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-bounce-fun">
            <span className="text-3xl">🎪</span>
          </div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 gradient-hero">
      <Card className="w-full max-w-md p-8 shadow-fun animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-bounce-fun">
            <span className="text-3xl">🎪</span>
          </div>
          <h1 className="text-2xl font-bold">UnderLiv Login</h1>
          <p className="text-sm text-muted-foreground mt-1">{opener}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Laundry Legend" 
              required
            />
          </div>
          
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="hero@underliv.lol" 
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required
            />
          </div>

          <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : (isRegistering ? 'Register' : 'Log Me In')}
          </Button>
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="w-full"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            {isRegistering 
              ? "Join the UnderLiv community!" 
              : "Super secure Django authentication. No more lost socks!"
            }
          </p>
        </form>
      </Card>
    </div>
  );
}
