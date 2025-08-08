
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isNewUser: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);
      
      if (user) {
        // Check if this user has a profile in Firestore
        try {
          const userProfileDoc = await getDoc(doc(db, "userProfiles", user.uid));
          // If user has no profile, mark as new user
          setIsNewUser(!userProfileDoc.exists());
          console.log('User profile exists:', userProfileDoc.exists());
        } catch (error) {
          console.error("Error checking user profile:", error);
        }
      }
      
      setLoading(false);
    });

    // Check for redirect result (for Google Auth)
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect result found:', result.user.email);
          // Handle the redirect result
          const userProfileDoc = await getDoc(doc(db, "userProfiles", result.user.uid));
          if (!userProfileDoc.exists()) {
            setIsNewUser(true);
            await setDoc(doc(db, "userProfiles", result.user.uid), {
              email: result.user.email,
              fullName: result.user.displayName,
              createdAt: new Date(),
              isOnboardingComplete: false,
            });
          }
        }
      } catch (error) {
        console.error("Error checking redirect result:", error);
      }
    };

    checkRedirectResult();

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user profile with the name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        
        // Mark this as a new user that needs onboarding
        setIsNewUser(true);
        
        // Create a basic user document in Firestore
        await setDoc(doc(db, "userProfiles", userCredential.user.uid), {
          email: userCredential.user.email,
          fullName: name,
          createdAt: new Date(),
          isOnboardingComplete: false,
        });
        
        console.log('User signed up successfully');
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "Sign up failed";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters";
          break;
        default:
          errorMessage = error.message || "Sign up failed";
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Sign in failed";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled";
          break;
        default:
          errorMessage = error.message || "Sign in failed";
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Try popup first, fallback to redirect
      let result;
      try {
        result = await signInWithPopup(auth, provider);
        console.log('Google sign in successful via popup');
      } catch (popupError: any) {
        console.log('Popup failed, trying redirect:', popupError.code);
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          // Fallback to redirect
          await signInWithRedirect(auth, provider);
          return; // Redirect will handle the result
        }
        throw popupError;
      }
      
      // Handle popup result
      if (result) {
        // Check if this is the first time this Google user is signing in
        const userProfileDoc = await getDoc(doc(db, "userProfiles", result.user.uid));
        
        if (!userProfileDoc.exists()) {
          // This is a new Google user, mark as needing onboarding
          setIsNewUser(true);
          
          // Create a basic user document
          await setDoc(doc(db, "userProfiles", result.user.uid), {
            email: result.user.email,
            fullName: result.user.displayName,
            createdAt: new Date(),
            isOnboardingComplete: false,
          });
        }
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      let errorMessage = "Google sign in failed";
      
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = "Popup was blocked. Please allow popups for this site.";
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign in was cancelled";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with this email using a different sign-in method";
          break;
        default:
          errorMessage = error.message || "Google sign in failed";
      }
      
      toast({
        title: "Google sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logOut = async () => {
    try {
      console.log('Attempting to sign out');
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    isNewUser,
    signUp,
    signIn,
    signInWithGoogle,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
