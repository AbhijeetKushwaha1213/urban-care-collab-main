
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';
import Button from './Button';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignIn) {
        // Sign in logic
        await signIn(email, password);
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        onClose();
      } else {
        // Sign up logic
        await signUp(email, password, name);
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        onClose();
      }
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      onClose();
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-background rounded-xl shadow-elevated max-w-md w-full mx-auto animate-scale-in overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-1">
            {isSignIn ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isSignIn 
              ? 'Sign in to your account to continue' 
              : 'Join our community to help improve your neighborhood'
            }
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your password"
                  required
                />
              </div>
            </div>
            
            {isSignIn && (
              <div className="text-right">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
            
            <Button className="w-full group" size="lg" isLoading={isLoading}>
              <span>{isSignIn ? 'Sign in' : 'Create account'}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <div className="relative flex items-center justify-center mt-6">
              <div className="border-t border-border flex-grow" />
              <span className="mx-3 text-xs text-muted-foreground">or continue with</span>
              <div className="border-t border-border flex-grow" />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>Google</span>
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              className="text-primary hover:underline" 
              onClick={toggleMode}
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
