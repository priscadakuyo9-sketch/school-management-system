import { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Mail, Phone, Calendar, Plus, UsersIcon, Loader2, Search, Pencil, Trash2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import API_URL from '../config';
import Modal from '../components/Modal';

const PAGE_SIZE = 6;

const SPECIALTIES = [
  'Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Philosophie',
  'Histoire-Géographie', 'Anglais', 'Espagnol', 'Éducation Physique',
  'Économie', 'Comptabilité', 'Informatique', 'Arts Plastiques', 'Musique'
];

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  // Filters
  const [filterSpecialty, setFilterSpecialty] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const blankForm = { firstName: '', lastName: '', email: '', phone: '', specialty: '' };
  const [formData, setFormData] = useState(blankForm);
  const [editData, setEditData] = useState(blankForm);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchTeachers = (query = '') => {
    fetch(`${API_URL}/school/teachers?search=${query}`, { headers })
      .then(res => res.json())
      .then(data => setTeachers(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchTeachers(searchTerm), 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Filtering & Pagination
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return teachers.filter(t => {
      const matchSearch = q === '' ||
        (t.user?.firstName || '').toLowerCase().includes(q) ||
        (t.user?.lastName || '').toLowerCase().includes(q) ||
        (t.specialty || '').toLowerCase().includes(q) ||
        (t.user?.email || '').toLowerCase().includes(q) ||
        (t.user?.phone || '').toLowerCase().includes(q);
      const matchSpecialty = filterSpecialty === '' || t.specialty === filterSpecialty;
      return matchSearch && matchSpecialty;
    });
  }, [teachers, searchTerm, filterSpecialty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/teachers`, {
        method: 'POST', headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTeachers();
        setFormData(blankForm);
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // Edit
  const openEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setEditData({
      firstName: teacher.user?.firstName || '',
      lastName: teacher.user?.lastName || '',
      email: teacher.user?.email || '',
      phone: teacher.user?.phone || '',
      specialty: teacher.specialty || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/teachers/${selectedTeacher.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchTeachers();
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // Delete
  const openDelete = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/teachers/${selectedTeacher.id}`, {
        method: 'DELETE', headers
      });
      if (res.ok) {
        setIsDeleteConfirmOpen(false);
        fetchTeachers();
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const TeacherFormFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
          <input required className="input-field" placeholder="Ex: Issaka" value={data.firstName}
            onChange={e => onChange({ ...data, firstName: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom</label>
          <input required className="input-field" placeholder="Ex: TRAORE" value={data.lastName}
            onChange={e => onChange({ ...data, lastName: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Spécialité</label>
        <select required className="input-field" value={data.specialty}
          onChange={e => onChange({ ...data, specialty: e.target.value })}>
          <option value="">Choisir une matière</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
          <input type="email" required className="input-field" placeholder="prof@edumanage.bf" value={data.email}
            onChange={e => onChange({ ...data, email: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
          <input type="tel" className="input-field" placeholder="+226 70 00 00 00" value={data.phone}
            onChange={e => onChange({ ...data, phone: e.target.value })} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-brand-500" size={32} />
            Corps Enseignant
          </h2>
          <p className="text-slate-500 mt-2 font-medium">{filtered.length} professeur(s) — Page {currentPage}/{totalPages}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Ajouter un Professeur</span>
        </button>
      </div>

      {/* ── Modal Création ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un professeur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TeacherFormFields data={formData} onChange={setFormData} />
          <button type="submit" disabled={isSubmitting} className="w-full btn-primary h-12 mt-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Créer le Profil'}
          </button>
        </form>
      </Modal>

      {/* ── Modal Modification ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
        title={`Modifier — ${selectedTeacher?.user?.firstName} ${selectedTeacher?.user?.lastName}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <TeacherFormFields data={editData} onChange={setEditData} />
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-amber-200 transition-all mt-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enregistrer les modifications'}
          </button>
        </form>
      </Modal>

      {/* ── Modal Suppression ── */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Confirmer la suppression">
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="text-rose-600 w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800">Supprimer le profil de</p>
            <p className="text-rose-600 font-black text-lg mt-1">
              {selectedTeacher?.user?.firstName} {selectedTeacher?.user?.lastName}
            </p>
            <p className="text-slate-500 text-sm mt-2">Cette action est irréversible.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteConfirmOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold h-11 rounded-2xl transition-all">
              Annuler
            </button>
            <button onClick={handleDelete} disabled={isSubmitting}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 rounded-2xl shadow-lg shadow-rose-200 transition-all">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-brand-50 p-3 rounded-xl text-brand-600"><UsersIcon size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total</p>
            <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Calendar size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Actifs</p>
            <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><BookOpen size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Spécialités</p>
            <p className="text-2xl font-black text-slate-900">{[...new Set(teachers.map(t => t.specialty))].length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><GraduationCap size={22} /></div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Résultats</p>
            <p className="text-2xl font-black text-slate-900">{filtered.length}</p>
          </div>
        </div>
      </div>

      {/* Barre recherche + filtres */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative bg-white border border-slate-200 rounded-xl shadow-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
          <input type="text" placeholder="Rechercher un professeur (nom, email)…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm outline-none font-medium placeholder-slate-400" />
        </div>
        <select value={filterSpecialty}
          onChange={e => { setFilterSpecialty(e.target.value); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
          <option value="">Toutes les spécialités</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {filterSpecialty && (
          <button onClick={() => { setFilterSpecialty(''); setCurrentPage(1); }}
            className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grille des cartes professeurs */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Aucun professeur trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((teacher) => {
            const tName = `${teacher.user?.firstName} ${teacher.user?.lastName}`;
            return (
              <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={teacher.user?.avatarUrl || `https://ui-avatars.com/api/?name=${teacher.user?.firstName}+${teacher.user?.lastName}&background=0284c7&color=fff`}
                    alt={tName}
                    className="w-16 h-16 rounded-2xl shadow-md border-2 border-white object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight truncate">{tName}</h3>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                      <BookOpen size={11} />{teacher.specialty}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button title="Modifier" onClick={() => openEdit(teacher)}
                      className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button title="Supprimer" onClick={() => openDelete(teacher)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Contacts */}
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Mail size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{teacher.user?.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    <span>{teacher.user?.phone || 'Non renseigné'}</span>
                  </div>
                </div>

                {/* Classes enseignées */}
                {teacher.classes?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.classes.map((c: any) => (
                      <span key={c.id} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase border border-slate-200">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-50/40 rounded-full blur-2xl group-hover:bg-brand-100/60 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          Affichage de <span className="font-bold text-slate-900">{Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}</span>
          {' '}à <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span>
          {' '}sur <span className="font-bold text-slate-900">{filtered.length}</span> professeur(s)
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`w-8 h-8 text-sm font-bold rounded-lg transition-all ${currentPage === p ? 'bg-brand-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
