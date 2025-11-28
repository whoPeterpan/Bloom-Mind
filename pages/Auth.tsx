
import React, { useState } from 'react';
import { GlassCard, Button3D } from '../components/ui/GlassComponents';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { initializeUser, seedDemoData } from '../utils/storage';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (!isLogin && !formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear prev errors
    
    // Simulate API Call
    setTimeout(() => {
      let user;

      // 1. LOGIN LOGIC
      if (isLogin) {
        // Enforce demo credentials for login ONLY
        if (formData.email !== 'test@example.com' || formData.password !== 'password') {
          setErrors(prev => ({ ...prev, general: 'Invalid email or password. For demo, use the credentials below.' }));
          setLoading(false);
          return;
        }
        
        // Mock User for Demo
        user = {
            id: "demo-user-123",
            name: "Test User",
            email: "test@example.com",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
            stats: { streak: 5, entries: 24, level: 3 },
            badges: ['Early Bird', 'Mindful']
        };

        // Seed data for the demo user
        seedDemoData(user.id);

      } else {
        // 2. SIGN UP LOGIC
        user = {
            id: `user-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            avatar: undefined,
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            stats: { streak: 0, entries: 0, level: 1 },
            badges: []
        };
        
        // Initialize empty storage for new user
        initializeUser(user.id);
      }
      
      try {
        localStorage.setItem('bloom_user', JSON.stringify(user));
        // Dispatch event to update Navbar immediately
        window.dispatchEvent(new Event('auth-change'));
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setErrors({ general: 'Failed to save login session. Please try again.' });
        setLoading(false);
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  };

  // Dynamic theme styles
  const focusRing = `focus:ring-${theme.accent}-400`;
  const focusText = `group-focus-within:text-${theme.accent}-600`;
  const linkText = `text-${theme.accent}-700`;

  // Helper class for input styling based on error state
  const getInputClass = (hasError: boolean) => `
    w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 border 
    focus:outline-none transition-all placeholder:text-slate-600 text-slate-900 font-medium
    ${hasError 
      ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
      : `border-slate-300 focus:ring-2 ${focusRing}`}
  `;

  // Helper class for icon styling based on error state
  const getIconClass = (hasError: boolean) => `
    absolute left-3 top-1/2 -translate-y-1/2 transition-colors 
    ${hasError ? 'text-red-500' : `text-slate-600 ${focusText}`}
  `;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8 relative overflow-hidden border-white/70">
        {/* Decorative BG Blob in card */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${theme.accent}-400 rounded-full blur-[60px] opacity-20 pointer-events-none`} />
        
        <div className="text-center mb-8">
          <h2 className={`font-display text-3xl font-bold ${theme.name === 'midnight' ? 'text-white' : 'text-slate-900'}`}>{isLogin ? 'Welcome Back' : 'Join BloomMind'}</h2>
          <p className={`font-medium mt-2 ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-700'}`}>{isLogin ? 'Continue your journey to wellness.' : 'Start your emotional growth today.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <div className="relative group">
                <User className={getIconClass(!!errors.name)} size={18} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name" 
                  className={getInputClass(!!errors.name)}
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{errors.name}</p>}
            </div>
          )}
          
          <div>
            <div className="relative group">
              <Mail className={getIconClass(!!errors.email)} size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address" 
                className={getInputClass(!!errors.email)}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{errors.email}</p>}
          </div>
          
          <div>
            <div className="relative group">
              <Lock className={getIconClass(!!errors.password)} size={18} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password" 
                className={getInputClass(!!errors.password)}
              />
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1 ml-1 font-medium">{errors.password}</p>}
          </div>

          {errors.general && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-medium">
              <AlertCircle size={16} className="shrink-0" />
              {errors.general}
            </div>
          )}

          <Button3D className="w-full mt-4 justify-center flex items-center gap-2" variant="primary" type="submit">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button3D>
        </form>

        <div className="mt-6 text-center">
           <p className={`text-sm font-medium ${theme.name === 'midnight' ? 'text-slate-400' : 'text-slate-700'}`}>
             {isLogin ? "Don't have an account? " : "Already have an account? "}
             <button onClick={toggleMode} className={`font-bold hover:underline ${linkText}`}>
               {isLogin ? 'Sign Up' : 'Log In'}
             </button>
           </p>
           {isLogin && (
             <div className="mt-4 text-xs text-slate-700 bg-slate-100 p-3 rounded-xl border border-slate-200 inline-block text-left">
               <p className="font-bold mb-1">🔑 Demo Credentials:</p>
               <p className="font-mono">Email: test@example.com</p>
               <p className="font-mono">Pass: password</p>
             </div>
           )}
        </div>
      </GlassCard>
    </div>
  );
};
