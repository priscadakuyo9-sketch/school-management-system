import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, UserPlus, FileDown, CheckCircle2, XCircle } from 'lucide-react';
import API_URL from '../config';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/school/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Fetch error", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Élèves</h2>
          <p className="text-slate-500 mt-2 font-medium">Consultez, ajoutez et gérez les dossiers complets des élèves.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors shadow-sm">
            <FileDown className="w-4 h-4" />
            Exporter (Excel)
          </button>
          <button className="btn-primary">
            <UserPlus className="w-4 h-4 mr-1" />
            Nouveau Dossier
          </button>
        </div>
      </div>

      {/* Barre d'outils du Tableau */}
      <div className="glass-card shadow-lg shadow-slate-200/40 p-1 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center rounded-2xl bg-white border border-slate-100">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule, parent..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm outline-none font-medium placeholder-slate-400"
          />
        </div>
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
        <div className="flex px-2 gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar">
          <button className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Classe (Toutes)
          </button>
          <button className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm">
            Statut (Tous)
          </button>
        </div>
      </div>

      {/* Tableau des Élèves - Design Premium */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Élève</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Parent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut Dossier</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">Aucun élève trouvé</td></tr>
              ) : students.map((student) => (
                <tr key={student.id} className="hover:bg-brand-50/40 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <img className="h-10 w-10 rounded-full shadow-sm border border-slate-200" src={student.user?.avatarUrl || `https://ui-avatars.com/api/?name=${student.user?.firstName}+${student.user?.lastName}&background=random`} alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{student.user?.firstName} {student.user?.lastName}</div>
                        <div className="text-xs text-slate-500 font-medium">Inscrit le {new Date(student.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">{student.enrollmentId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-bold">{student.class?.name || 'Non assigné'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 font-medium">{student.parentName || 'Non spécifié'}</div>
                    <div className="text-xs text-slate-500">{student.user?.phone || 'Non spécifié'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status || 'En règle'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-brand-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Affichage de <span className="font-bold text-slate-900">1</span> à <span className="font-bold text-slate-900">6</span> sur <span className="font-bold text-slate-900">1 245</span> élèves</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Précédent</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'En règle') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  if (status === 'Impayé') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
        <XCircle className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
      {status}
    </span>
  );
}
