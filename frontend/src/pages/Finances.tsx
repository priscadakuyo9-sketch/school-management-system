import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Search, FileDown, Wallet, CheckCircle, XCircle, Clock } from 'lucide-react';
import API_URL from '../config';

export default function Finances() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/school/payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Fetch error", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Wallet className="text-emerald-500" size={32} />
            Gestion Financière
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Suivi des scolarités, factures et revenus de l'établissement.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm">
            <FileDown className="w-4 h-4" />
            Exporter (CSV)
          </button>
          <button className="btn-primary-emerald">
            <span>+ Facturer un Élève</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinanceCard 
          title="CA Mensuel" 
          value="58 400 €" 
          change="+12.5%" 
          trend="up" 
          icon={<DollarSign size={24} />} 
          color="emerald" 
        />
        <FinanceCard 
          title="Impayés Totaux" 
          value="14 500 €" 
          change="-5.2%" 
          trend="down" 
          icon={<Clock size={24} />} 
          color="rose" 
          positiveDown={true}
        />
        <FinanceCard 
          title="Recouvrement" 
          value="84.2%" 
          change="+2.4%" 
          trend="up" 
          icon={<TrendingUp size={24} />} 
          color="indigo" 
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Dernières Transactions</h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher une transaction..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm transition-all outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4">Élève / Client</th>
                <th className="px-6 py-4">Désignation</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Méthode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">Aucune transaction trouvée</td></tr>
              ) : transactions.map((trx) => {
                const studentName = trx.student?.user ? `${trx.student.user.firstName} ${trx.student.user.lastName}` : 'Inconnu';
                const initial = studentName.charAt(0);
                
                return (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">
                        {initial}
                      </div>
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 tracking-tight">{trx.description || trx.type}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{trx.amount} {trx.currency || '€'}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{new Date(trx.dueDate || trx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trx.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100">
                      <CreditCard size={14} />
                      {trx.method || 'Carte'}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, change, trend, icon, color, positiveDown=false }: any) {
  const isGood = trend === 'up' ? !positiveDown : positiveDown;
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-50 hover:border-emerald-200',
    rose: 'text-rose-500 bg-rose-50 hover:border-rose-200',
    indigo: 'text-indigo-500 bg-indigo-50 hover:border-indigo-200',
  };

  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl border-2 border-white shadow-sm ${colors[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Payé' || status === 'COMPLETED') return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg"><CheckCircle size={12} /> PAYÉ</span>;
  if (status === 'Échoué' || status === 'FAILED') return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg"><XCircle size={12} /> ÉCHOUÉ</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg"><Clock size={12} /> EN ATTENTE</span>;
}
