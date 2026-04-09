import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Search, FileDown, Wallet, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import API_URL from '../config';
import Modal from '../components/Modal';

export default function Finances() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    description: '',
    installment: '1',
    status: 'PENDING'
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/school/payments`, { headers });
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }

    fetch(`${API_URL}/school/stats`, { headers })
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  };

  useEffect(() => {
    fetchPayments();
    // Charger tous les élèves pour le sélecteur
    fetch(`${API_URL}/school/students`, { headers })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setStudents(d); })
      .catch(console.error);
  }, []);

  // Filtre côté client
  const filtered = transactions.filter(t => {
    const name = `${t.student?.user?.firstName} ${t.student?.user?.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/school/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          dueDate: new Date().toISOString()
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchPayments();
        setFormData({ studentId: '', amount: '', description: '', installment: '1', status: 'PENDING' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary-emerald"
          >
            <span>+ Facturer un Élève</span>
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer une facture">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sélectionner l'Élève</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
              value={formData.studentId}
              onChange={e => setFormData({...formData, studentId: e.target.value})}
            >
              <option value="">-- Choisir un élève --</option>
              {students
                .sort((a, b) => (a.user?.lastName || '').localeCompare(b.user?.lastName || ''))
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.user?.lastName?.toUpperCase()} {s.user?.firstName} — {s.class?.name || 'Sans classe'}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Montant (F CFA)</label>
            <input 
              type="number"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
              placeholder="Ex: 100000"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Désignation</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
              placeholder="Ex: Scolarité Trimestre 2"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-emerald-200 transition-all mt-4"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Émettre la Facture"}
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinanceCard 
          title="CA Global" 
          value={`${stats.totalRevenue?.toLocaleString() || 0} F CFA`} 
          change="+12.5%" 
          trend="up" 
          icon={<DollarSign size={24} />} 
          color="emerald" 
        />
        <FinanceCard 
          title="Impayés Totaux" 
          value={`${stats.pendingRevenue?.toLocaleString() || 0} F CFA`} 
          change="-5.2%" 
          trend="down" 
          icon={<Clock size={24} />} 
          color="rose" 
          positiveDown={true}
        />
        <FinanceCard 
          title="Taux Recouvrement" 
          value={`${stats.totalRevenue > 0 ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingRevenue)) * 100) : 0}%`} 
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
              placeholder="Rechercher un élève, une désignation..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm transition-all outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-wider">
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Désignation</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Date Échéance</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Méthode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Aucune transaction trouvée</td></tr>
              ) : filtered.map((trx) => {
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
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase italic">{trx.student?.class?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 tracking-tight">{trx.description || trx.type}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{trx.amount.toLocaleString()} {trx.currency || 'XOF'}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{new Date(trx.dueDate || trx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trx.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100">
                      <CreditCard size={14} />
                      {trx.method || 'Banque'}
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
