import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp, Users, Wallet, CreditCard as CreditCardIcon, BarChart } from 'lucide-react';
import API_URL from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vue d'ensemble</h2>
          <p className="text-slate-500 mt-2 font-medium">Bienvenue. Voici l'état de l'établissement aujourd'hui, le {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.</p>
        </div>
        <button className="btn-primary shrink-0 group">
          <span>+ Nouvelle Inscription</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Cartes Clés (KPIs) avec de sublimes dégradés et icônes absolues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Total Élèves" 
          value={stats.students.toString()} 
          change="+nouv." 
          trend="up" 
          icon={<Users className="w-24 h-24 text-brand-500/10 absolute -bottom-4 -right-4 -rotate-12 transition-transform group-hover:scale-110 group-hover:-rotate-6" />}
        />
        <KpiCard 
          title="Taux Présence" 
          value="98.2%" 
          change="+1.5%" 
          trend="up" 
          icon={<TrendingUp className="w-24 h-24 text-indigo-500/10 absolute -bottom-4 -right-4 -rotate-12 transition-transform group-hover:scale-110 group-hover:-rotate-6" />}
          borderClass="hover:border-indigo-200"
          valueClass="text-indigo-900"
        />
        <KpiCard 
          title="Revenus Mensuels" 
          value="58 400 €" 
          change="+4300 €" 
          trend="up" 
          icon={<Wallet className="w-24 h-24 text-emerald-500/10 absolute -bottom-4 -right-4 -rotate-12 transition-transform group-hover:scale-110 group-hover:-rotate-6" />}
          borderClass="hover:border-emerald-200"
          valueClass="text-emerald-900"
        />
        <KpiCard 
          title="Retards Paiement" 
          value="14 500 €" 
          change="-5%" 
          trend="down" // Down pour des impayés, c'est positif !
          positiveDown={true}
          icon={<CreditCardIcon className="w-24 h-24 text-rose-500/10 absolute -bottom-4 -right-4 -rotate-12 transition-transform group-hover:scale-110 group-hover:-rotate-6" />}
          borderClass="hover:border-rose-200"
        />
      </div>

      {/* Section Dashboard Composants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique d'activité (Placeholder sublime) */}
        <div className="lg:col-span-2 glass-card p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Évolution des Inscriptions</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2">
              <option>Cette année</option>
              <option>L'année dernière</option>
            </select>
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-50/50 border border-slate-100 flex items-center justify-center text-slate-400/50 font-medium">
            <div className="text-center">
              <BarChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Module Graphique Réel à Connecter (Recharts/Chart.js)</p>
            </div>
          </div>
        </div>

        {/* Activité récente détaillée */}
        <div className="glass-card p-6 h-[400px] overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-2">Activité Récente</h3>
          <div className="space-y-6 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <ActivityItem time="Il y a 10 min" title="Nouvelle inscription validée" desc="Emma Dubois (Classe de 3ème)" type="success" />
            <ActivityItem time="Il y a 1 heure" title="Paiement reçu" desc="Frais de scolarité - Jean Martin (450€)" type="finance" />
            <ActivityItem time="Hier" title="Absence signalée" desc="Prof. Lemaire (Mathématiques) - Remplacement nécessaire" type="warning" />
            <ActivityItem time="Hier" title="Bulletin envoyé" desc="Bulletins T1 envoyés à l'ensemble des parents" type="info" />
          </div>
        </div>
      </div>
    </div>
  );
}



function KpiCard({ title, value, change, trend, icon, borderClass="hover:border-brand-200", valueClass="text-slate-900", positiveDown=false }: any) {
  // Logique pour déterminer si la baisse est positive (ex: Baisse des dettes)
  const isGood = trend === 'up' ? !positiveDown : positiveDown;

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${borderClass}`}>
      {icon}
      <div className="relative z-10">
        <h4 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</h4>
        <div className="mt-4 flex items-baseline gap-3">
          <span className={`text-4xl font-black tracking-tight ${valueClass}`}>{value}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1
            ${isGood ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend === 'up' ? '↗' : '↘'} {change}
          </span>
          <span className="text-xs text-slate-400 font-medium">vs. mois dernier</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ time, title, desc, type }: any) {
  const colors = {
    success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    finance: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    warning: 'bg-rose-100 text-rose-600 border-rose-200',
    info: 'bg-sky-100 text-sky-600 border-sky-200',
  };
  
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 ${colors[type as keyof typeof colors]}`}></div>
        <div className="w-px h-full bg-slate-100 group-last:hidden mt-2"></div>
      </div>
      <div className="pb-4">
        <p className="text-xs font-bold text-slate-400 mb-1">{time}</p>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 font-medium mt-0.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}
