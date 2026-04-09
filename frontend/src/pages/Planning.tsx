import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Plus, GraduationCap, BookOpen, Loader2, Trash2 } from 'lucide-react';
import API_URL from '../config';
import Modal from '../components/Modal';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const SLOTS = ['07:00-09:00', '09:00-09:45', '10:10-11:00', '11:00-12:00', '15:00-16:30', '16:30-18:00'];
const PAUSE_SLOT = '09:45-10:10'; // Récréation Lycée/Collège
const COLORS = [
  { border: 'border-indigo-500', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', shadow: 'shadow-indigo-100/50' },
  { border: 'border-rose-500', bg: 'bg-rose-50 text-rose-700 border-rose-100', shadow: 'shadow-rose-100/50' },
  { border: 'border-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-100', shadow: 'shadow-amber-100/50' },
  { border: 'border-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', shadow: 'shadow-emerald-100/50' },
  { border: 'border-violet-500', bg: 'bg-violet-50 text-violet-700 border-violet-100', shadow: 'shadow-violet-100/50' },
];

export default function Planning() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');

  // Week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

  const [formData, setFormData] = useState({
    name: '', teacherId: '', classId: '', room: '',
    day: 'Lundi', slot: '07:00-09:00', description: ''
  });

  // Labels lisibles pour les créneaux
  const SLOT_LABELS: Record<string, string> = {
    '07:00-09:00': '07h00 – 09h00',
    '09:00-09:45': '09h00 – 09h45',
    '10:10-11:00': '10h10 – 11h00',
    '11:00-12:00': '11h00 – 12h00',
    '15:00-16:30': '15h00 – 16h30',
    '16:30-18:00': '16h30 – 18h00',
  };

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchData = async () => {
    try {
      const [cRes, tRes, clRes] = await Promise.all([
        fetch(`${API_URL}/school/courses`, { headers }),
        fetch(`${API_URL}/school/teachers`, { headers }),
        fetch(`${API_URL}/school/classes`, { headers })
      ]);
      const [cData, tData, clData] = await Promise.all([cRes.json(), tRes.json(), clRes.json()]);
      setCourses(Array.isArray(cData) ? cData : []);
      setTeachers(Array.isArray(tData) ? tData : []);
      setClasses(Array.isArray(clData) ? clData : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/courses`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        setFormData({ name: '', teacherId: '', classId: '', room: '', day: 'Lundi', slot: '07:00-09:00', description: '' });
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/school/courses/${selectedCourse.id}`, {
        method: 'DELETE', headers
      });
      setIsDeleteOpen(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // Apply filters
  const filtered = courses.filter(c => {
    const matchClass = filterClass === '' || c.class?.id === filterClass;
    const matchTeacher = filterTeacher === '' || c.teacher?.id === filterTeacher;
    return matchClass && matchTeacher;
  });

  // Normalize slot for comparison (handle both dash variants)
  const normalizeSlot = (s: string) => s.replace(/–/g, '-').replace(/—/g, '-');

  const getCoursesForDaySlot = (day: string, slot: string) =>
    filtered.filter(c => c.day === day && normalizeSlot(c.slot) === normalizeSlot(slot));

  const formatDate = (offset: number) => {
    const d = new Date(currentMonday);
    d.setDate(currentMonday.getDate() + offset);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Calendar className="text-indigo-500" size={32} />
            Emplois du Temps
          </h2>
          <p className="text-slate-500 mt-2 font-medium">{filtered.length} cours planifié(s)</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary-indigo">
          <Plus size={20} /><span>Ajouter un Cours</span>
        </button>
      </div>

      {/* ── Modal Création ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Programmer un nouveau cours">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Matière / Nom du Cours</label>
            <input required className="input-field" placeholder="Ex: Mathématiques" value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Classe</label>
              <select required className="input-field" value={formData.classId}
                onChange={e => setFormData({...formData, classId: e.target.value})}>
                <option value="">Sélectionner...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Professeur</label>
              <select required className="input-field" value={formData.teacherId}
                onChange={e => setFormData({...formData, teacherId: e.target.value})}>
                <option value="">Sélectionner...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.lastName?.toUpperCase()} {t.user?.firstName} — {t.specialty}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Jour</label>
              <select className="input-field" value={formData.day}
                onChange={e => setFormData({...formData, day: e.target.value})}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Créneau horaire</label>
              <select className="input-field" value={formData.slot}
                onChange={e => setFormData({...formData, slot: e.target.value})}>
                {SLOTS.map(s => <option key={s} value={s}>{SLOT_LABELS[s] ?? s}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Salle</label>
            <input className="input-field" placeholder="Ex: Salle A101" value={formData.room}
              onChange={e => setFormData({...formData, room: e.target.value})} />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-2xl shadow-lg transition-all mt-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Planifier le Cours'}
          </button>
        </form>
      </Modal>

      {/* ── Modal Suppression ── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Supprimer ce cours ?">
        <div className="space-y-5">
          <p className="text-slate-600">Voulez-vous supprimer le cours <span className="font-black text-slate-900">"{selectedCourse?.name}"</span> ?</p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold h-11 rounded-2xl">Annuler</button>
            <button onClick={handleDelete} disabled={isSubmitting}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 rounded-2xl shadow-lg shadow-rose-100">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none">
          <option value="">Toutes les classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none">
          <option value="">Tous les professeurs</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.lastName?.toUpperCase()} {t.user?.firstName}</option>)}
        </select>
        {(filterClass || filterTeacher) && (
          <button onClick={() => { setFilterClass(''); setFilterTeacher(''); }}
            className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Navigation semaine */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between mb-6">
        <button onClick={() => setWeekOffset(w => w - 1)}
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Semaine du {formatDate(0)} au {formatDate(5)}
          </p>
          <button onClick={() => setWeekOffset(0)}
            className="text-xs font-bold text-indigo-500 hover:underline mt-0.5">
            Aujourd'hui
          </button>
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)}
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Grille Weekly */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          <div className="p-3 bg-slate-50/80" />
          {DAYS.map((day, i) => (
            <div key={day} className="p-3 border-l border-slate-100 bg-slate-50/80 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{day}</p>
              <p className={`text-sm font-black mt-0.5 ${formatDate(i) === today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) ? 'text-indigo-600' : 'text-slate-700'}`}>
                {formatDate(i)}
              </p>
            </div>
          ))}
        </div>

        {/* Corps de la grille */}
        {SLOTS.map((slot, slotIdx) => (
          <>
            {/* Ligne de PAUSE récréation avant 10:10-11:00 */}
            {slot === '10:10-11:00' && (
              <div key="pause" className="grid grid-cols-7 border-b border-amber-200 bg-amber-50/70 min-h-[36px]">
                <div className="p-2 border-r border-amber-200 flex items-center justify-end">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Clock size={11} />
                    <span className="text-[10px] font-black">{PAUSE_SLOT}</span>
                  </div>
                </div>
                <div className="col-span-6 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">☕ Récréation — Lycée & Collège</span>
                </div>
              </div>
            )}
            <div key={slot} className="grid grid-cols-7 border-b border-slate-50 min-h-[80px]">
              <div className="p-3 bg-slate-50/40 border-r border-slate-100 flex items-start justify-end">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{slot}</span>
                </div>
              </div>
              {DAYS.map(day => {
                const dayCourses = getCoursesForDaySlot(day, slot);
                return (
                  <div key={day} className="p-1.5 border-l border-slate-100 space-y-1 hover:bg-slate-50/50 transition-colors">
                    {dayCourses.map((c, idx) => {
                      const col = COLORS[idx % COLORS.length];
                      return (
                        <div key={c.id}
                          className={`relative p-2 rounded-xl border-l-4 bg-white shadow-sm ${col.border} ${col.shadow} group cursor-default`}>
                          <p className="text-xs font-black text-slate-800 truncate">{c.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <BookOpen size={10} className="text-slate-400" />
                            <span className="text-[10px] text-slate-500 font-medium truncate">{c.class?.name}</span>
                          </div>
                          {c.room && (
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-slate-400" />
                              <span className="text-[10px] text-slate-400">{c.room}</span>
                            </div>
                          )}
                          {c.teacher && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <GraduationCap size={10} className="text-slate-400" />
                              <span className="text-[10px] text-slate-500 truncate">{c.teacher?.user?.lastName}</span>
                            </div>
                          )}
                          <button
                            onClick={() => { setSelectedCourse(c); setIsDeleteOpen(true); }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 text-rose-400 hover:bg-rose-50 rounded transition-all">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
