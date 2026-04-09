import { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle2, Clock, AlertCircle, Plus, FileText } from 'lucide-react';
import API_URL from '../config';
import Modal from '../components/Modal';

export default function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchComplaints = () => {
    // Statiques ou API
    setComplaints([
      { id: 1, title: "Cantine scolaire", description: "Le riz de mardi était trop salé.", solution: "Signalé au chef, dosage réduit.", status: "RESOLVED", date: "2025-04-05" },
      { id: 2, title: "Climatisation Salle 4", description: "Il fait trop chaud l'après-midi.", solution: "Technicien appelé pour lundi.", status: "OPEN", date: "2025-04-08" }
    ]);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <MessageCircle className="text-brand-500" size={32} />
            Plaintes & Solutions
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Espace dédié aux retours des élèves et parents pour l'amélioration continue.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Nouvelle Plainte</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {complaints.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {c.status === 'RESOLVED' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{c.title}</h4>
                </div>
                <span className="text-xs font-bold text-slate-400">{new Date(c.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{c.description}</p>
              {c.solution && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-brand-600 uppercase mb-1 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Solution apportée :
                  </p>
                  <p className="text-sm text-slate-700 font-medium italic">"{c.solution}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-xl shadow-brand-200/50">
            <FileText className="mb-4 opacity-70" size={32} />
            <h3 className="text-xl font-bold mb-2">Règlement Intérieur</h3>
            <p className="text-brand-50 text-sm mb-6 leading-relaxed">
              Consultez les normes de conduite de l'établissement EduManage pour garantir un environnement d'excellence au Burkina Faso.
            </p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-all text-sm uppercase tracking-widest">
              Télécharger le PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
