import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Plus, GraduationCap, Layers } from 'lucide-react';

const mockSchedule = [
  { time: '08:00 - 10:00', subject: 'Mathématiques', professeur: 'M. Dupont', classroom: 'Salle A102', class: '3ème B', color: 'indigo' },
  { time: '10:15 - 12:15', subject: 'Français', professeur: 'Mme Martin', classroom: 'Salle B201', class: '3ème B', color: 'rose' },
  { time: '13:30 - 15:30', subject: 'Physique-Chimie', professeur: 'M. Lefebvre', classroom: 'Salle Labo 1', class: '3ème B', color: 'amber' },
  { time: '15:45 - 17:45', subject: 'Anglais', professeur: 'Mme Smith', classroom: 'Salle C304', class: '3ème B', color: 'emerald' },
];

export default function Planning() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Calendar className="text-indigo-500" size={32} />
            Emplois du Temps
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Gestion des cours, des salles et des événements scolaires.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Layers className="w-4 h-4" />
            Gestion des Salles
          </button>
          <button className="btn-primary-indigo">
            <Plus size={20} />
            <span>Ajouter un Cours</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtres et Sélecteurs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Filtrer par</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Classe</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
                  <option>Toutes les classes</option>
                  <option>6ème A</option>
                  <option>3ème B</option>
                  <option>Terminale S</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Professeur</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none">
                  <option>Tous les professeurs</option>
                  <option>M. Jean Dupont</option>
                  <option>Mme Sophie Martin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Clock size={20} />
              <span className="font-bold text-sm uppercase tracking-tight">Prochain Cours</span>
            </div>
            <p className="text-lg font-black text-slate-900 leading-tight">Mathématiques</p>
            <p className="text-slate-500 text-xs font-semibold mt-1">Salle A102 • 08:00 - 10:00</p>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <ArrowRight className="text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Vue Calendrier/Journalière */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lundi 01 Avril 2026</h3>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-sm">Jour</button>
              <button className="px-4 py-1.5 text-slate-500 text-xs font-bold rounded-lg hover:text-slate-900 transition-colors">Semaine</button>
            </div>
          </div>

          <div className="space-y-4">
            {mockSchedule.map((session, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="w-32 pt-4 flex flex-col items-end shrink-0">
                  <span className="text-sm font-black text-slate-900">{session.time.split(' - ')[0]}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{session.time.split(' - ')[1]}</span>
                </div>
                <div className={`relative w-full p-6 rounded-2xl border-l-8 bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.01] flex justify-between items-center
                  ${session.color === 'indigo' ? 'border-indigo-500 shadow-indigo-100/50' : 
                    session.color === 'rose' ? 'border-rose-500 shadow-rose-100/50' : 
                    session.color === 'amber' ? 'border-amber-500 shadow-amber-100/50' : 'border-emerald-500 shadow-emerald-100/50'}`}>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border
                         ${session.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                           session.color === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                           session.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                         {session.class}
                       </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{session.subject}</h4>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold uppercase">
                        <GraduationCap size={16} className="text-slate-400" />
                        {session.professeur}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold uppercase">
                        <MapPin size={16} className="text-slate-400" />
                        {session.classroom}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component and Icon quick fixes
import { ArrowRight } from 'lucide-react';
