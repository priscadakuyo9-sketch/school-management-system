import { Shield, Key, Lock, Users, Activity, Eye, RefreshCw } from 'lucide-react';

export default function Security() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="text-rose-500" size={32} />
            Espace Sécurité
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Contrôle d'accès, gestion des privilèges et surveillance de l'infrastructure numérique.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-all text-sm uppercase">
            <Lock size={16} /> Verrouiller Tout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatusCard icon={<Key size={24} />} label="Clés API Actives" value="12" status="SAFE" />
        <StatusCard icon={<Users size={24} />} label="Sessions Admin" value="3" status="ACTIVE" />
        <StatusCard icon={<Activity size={24} />} label="Santé Système" value="100%" status="GOOD" />
        <StatusCard icon={<Lock size={24} />} label="Accès Bloqués" value="24" status="ALERT" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
              <Eye size={18} className="text-brand-500" /> Historique des Accès
            </h3>
            <button className="text-slate-400 hover:text-brand-600 transition-colors"><RefreshCw size={18} /></button>
          </div>
          <div className="space-y-4">
            <LogItem user="Traoré Moussa" action="Connexion Admin" time="Aujourd'hui, 08:30" status="SUCCESS" />
            <LogItem user="Ouédraogo Idrissa" action="Modification Notes" time="Hier, 17:45" status="SUCCESS" />
            <LogItem user="Inconnu (IP: 196.25...)" action="Tentative de Login" time="Hier, 23:12" status="FAILED" />
            <LogItem user="Système" action="Mise à jour Auto" time="07 Avril, 02:00" status="SUCCESS" />
          </div>
        </div>

        <div className="glass-card p-6 min-h-[400px]">
           <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Lock size={18} className="text-amber-500" /> Contrôle des Rôles
            </h3>
            <div className="space-y-4">
               <RoleTile role="SUPERADMIN" count={1} desc="Accès total à l'établissement." />
               <RoleTile role="ADMIN" count={3} desc="Gestion élèves, profs et finances." />
               <RoleTile role="ENSEIGNANT" count={14} desc="Accès au planning et saisie de notes." />
               <RoleTile role="PARENTS" count={245} desc="Consultation uniquement." />
            </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, status }: any) {
  const colors: any = {
    SAFE: 'text-emerald-500 bg-emerald-50',
    ACTIVE: 'text-sky-500 bg-sky-50',
    GOOD: 'text-brand-500 bg-brand-50',
    ALERT: 'text-rose-500 bg-rose-50',
  };
  return (
    <div className={`p-6 rounded-2xl border border-slate-100 flex flex-col justify-between bg-white shadow-sm hover:shadow-lg transition-all`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[status]}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

function LogItem({ user, action, time, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
        <div>
          <p className="text-sm font-bold text-slate-800 tracking-tight">{action}</p>
          <p className="text-xs text-slate-500 font-medium">{user} • {time}</p>
        </div>
      </div>
    </div>
  );
}

function RoleTile({ role, count, desc }: any) {
    return (
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 group hover:bg-white hover:border-brand-200 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-900 tracking-wider font-mono">{role}</span>
                <span className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded text-[10px] font-black">{count}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed group-hover:text-slate-600">{desc}</p>
        </div>
    )
}
