import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  GraduationCap, 
  CalendarDays, 
  Settings, 
  Bell,
  Search,
  BookOpen,
  CreditCard,
  LogOut,
  LifeBuoy,
  Send,
  Loader2,
  MessageCircle,
  Shield
} from 'lucide-react';
import Modal from './Modal';
import API_URL from '../config';

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await fetch(`${API_URL}/school/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: 'Demande Support Admin',
          message: supportMsg,
          userId: 'system'
        })
      });
      alert('Message envoyé au support technique !');
      setIsSupportModalOpen(false);
      setSupportMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10 transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-brand-50 p-2 rounded-xl">
            <BookOpen className="text-brand-500 w-7 h-7" />
          </div>
          <h1 className="text-xl font-black bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent tracking-tight">
            EduManage
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5">
          <NavItem to="" icon={<BarChart size={20} strokeWidth={2.5} />} label="Tableau de bord" />
          <NavItem to="students" icon={<Users size={20} strokeWidth={2.5} />} label="Gestion Élèves" />
          <NavItem to="teachers" icon={<GraduationCap size={20} strokeWidth={2.5} />} label="Professeurs" />
          <NavItem to="planning" icon={<CalendarDays size={20} strokeWidth={2.5} />} label="Planning & Salles" />
          <NavItem to="complaints" icon={<MessageCircle size={20} strokeWidth={2.5} />} label="Plaintes & Solutions" />
          <div className="my-4 border-t border-slate-100"></div>
          <NavItem to="finances" icon={<CreditCard size={20} strokeWidth={2.5} />} label="Finances & Frais" />
          <NavItem to="security" icon={<Shield size={20} strokeWidth={2.5} />} label="Espace Sécurité" />
        </nav>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
          <NavItem to="settings" icon={<Settings size={20} strokeWidth={2.5} />} label="Configuration" />
          <button 
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-brand-600 font-medium transition-all"
          >
            <LifeBuoy size={20} strokeWidth={2.5} />
            Support Technique
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-medium transition-all"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Déconnexion
          </button>
        </div>
      </aside>

      <Modal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} title="Support Technique">
        <form onSubmit={handleSendSupport} className="space-y-4">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Un problème technique ? Envoyez-nous un message et notre équipe interviendra dans les plus brefs délais.
          </p>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Votre message</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none resize-none"
              placeholder="Décrivez votre problème..."
              value={supportMsg}
              onChange={e => setSupportMsg(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSending}
            className="w-full bg-brand-600 text-white h-12 mt-2 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
              <div className="flex items-center justify-center gap-2">
                <Send size={18} />
                <span>Envoyer au Support</span>
              </div>
            )}
          </button>
        </form>
      </Modal>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="relative w-[28rem]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Recherche rapide (Élève, ID matricule, Facture...)" 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/70 border border-transparent rounded-xl focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 text-sm transition-all outline-none font-medium placeholder-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-2.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
              <Bell size={20} strokeWidth={2.5} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 rounded-xl transition-all">
              <div className="text-right">
                <p className="font-bold text-slate-800 text-sm leading-none group-hover:text-brand-600 transition-colors">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-slate-500 text-xs mt-1 font-medium">{user.role}</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=14b8a6&color=fff&bold=true`} alt="Admin" className="w-10 h-10 rounded-xl shadow-sm border border-slate-200 group-hover:border-brand-200 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Injecté ici (Le composant Outlet) */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Sous-composant pour les liens de navigations (plus intelligents grâce à NavLink)
function NavItem({ icon, label, to }: { icon: ReactNode, label: string, to: string }) {
  return (
    <NavLink 
      to={to} 
      end={to === ''}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-medium
        ${isActive 
          ? 'bg-brand-50 text-brand-700 shadow-[inset_4px_0_0_0_#14b8a6]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-500'} transition-colors`}>
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}
