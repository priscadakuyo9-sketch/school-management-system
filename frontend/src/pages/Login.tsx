import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function Login({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'une connexion (on attend 1.5s pour l'effet "Super")
    setTimeout(() => {
      setLoading(false);
      setIsAuthenticated(true);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-br from-brand-50 via-slate-50 to-white">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl shadow-slate-200/50 flex overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-12 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/></pattern></defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">EduManage</h1>
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black leading-tight tracking-tighter">Gérez votre école <br />en toute <span className="text-brand-300">sérénité.</span></h2>
              <p className="text-brand-100 text-lg font-medium max-w-sm">Le système de gestion scolaire le plus avancé, intuitif et complet pour les établissements d'excellence.</p>
              
              <div className="flex gap-4 pt-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex-1">
                  <p className="text-3xl font-black">1.2k+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-200 opacity-80">Élèves Inscrits</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex-1">
                  <p className="text-3xl font-black">98%</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-200 opacity-80">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-brand-200 text-xs font-bold uppercase tracking-widest flex justify-between items-center opacity-60">
              <p>© 2026 EduManage Inc.</p>
              <p>v2.4.0 High-Performance</p>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-12 sm:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Bon retour !</h3>
            <p className="text-slate-500 font-medium mb-10">Connectez-vous à votre espace administratif.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                   <input 
                    type="email" 
                    required
                    placeholder="directeur@ecole.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 text-sm font-medium transition-all outline-none"
                   />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mot de Passe</label>
                  <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-widest">Oublié ?</a>
                </div>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                   <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 text-sm font-medium transition-all outline-none"
                   />
                   <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                   >
                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                   </button>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-500">Rester connecté</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary h-14 text-lg mt-4 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>S'authentifier</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500 font-medium">Pas encore de compte d'administration ?</p>
              <a href="#" className="inline-block mt-2 text-sm font-black text-slate-900 border-b-2 border-brand-500 pb-0.5 hover:text-brand-600 transition-colors uppercase tracking-tight">Contacter le support technique</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
