import { useState, useEffect, useMemo } from 'react';
import { Search, UserPlus, FileDown, CheckCircle2, XCircle, Loader2, Pencil, Trash2, ChevronLeft, ChevronRight, Users, BookOpen } from 'lucide-react';
import API_URL from '../config';
import Modal from '../components/Modal';

const PAGE_SIZE = 10;

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (Create & Edit)
  const blankForm = {
    firstName: '', lastName: '', email: '', phone: '',
    enrollmentId: `ENR-${Date.now().toString().slice(-6)}`,
    dateOfBirth: '2010-01-01', gender: 'Garçon', classId: ''
  };
  const [formData, setFormData] = useState(blankForm);
  const [editData, setEditData] = useState(blankForm);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // ── Export CSV ─────────────────────────────────────────────
  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const BOM = '\uFEFF'; // UTF-8 BOM pour Excel
    const cols = ['Nom', 'Prénom', 'Matricule', 'Classe', 'Genre', 'Téléphone', 'Email', 'Date Inscription'];
    const rows = filtered.map(s => [
      s.user?.lastName?.toUpperCase() || '',
      s.user?.firstName || '',
      s.enrollmentId || '',
      s.class?.name || 'Non assigné',
      s.gender || '',
      s.user?.phone || '',
      s.user?.email || '',
      new Date(s.createdAt).toLocaleDateString('fr-FR')
    ]);
    const csv = BOM + [cols, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eleves_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchStudents = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/school/students?search=${query}`, { headers });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchStudents(searchTerm), 300);
    fetch(`${API_URL}/school/classes`, { headers })
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setClasses(d); }).catch(() => {});
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // ── Filtering & Pagination ─────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return students.filter(s => {
      const matchSearch = q === '' ||
        (s.user?.firstName || '').toLowerCase().includes(q) ||
        (s.user?.lastName || '').toLowerCase().includes(q) ||
        (s.enrollmentId || '').toLowerCase().includes(q) ||
        (s.user?.email || '').toLowerCase().includes(q) ||
        (s.user?.phone || '').toLowerCase().includes(q);
      const matchClass = filterClass === '' || s.class?.name === filterClass;
      const matchGender = filterGender === '' || s.gender === filterGender;
      const matchStatus = filterStatus === '' || (s.status || 'En règle') === filterStatus;
      return matchSearch && matchClass && matchGender && matchStatus;
    });
  }, [students, searchTerm, filterClass, filterGender, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ── Create ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/students`, {
        method: 'POST', headers,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStudents();
        setFormData({ ...blankForm, enrollmentId: `ENR-${Date.now().toString().slice(-6)}` });
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // ── Edit ──────────────────────────────────────────────────
  const openEdit = (student: any) => {
    setSelectedStudent(student);
    setEditData({
      firstName: student.user?.firstName || '',
      lastName: student.user?.lastName || '',
      email: student.user?.email || '',
      phone: student.user?.phone || '',
      enrollmentId: student.enrollmentId || '',
      dateOfBirth: student.dateOfBirth?.slice(0, 10) || '2010-01-01',
      gender: student.gender || 'Garçon',
      classId: student.classId || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/students/${selectedStudent.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchStudents();
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // ── Delete ─────────────────────────────────────────────────
  const openDelete = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/school/students/${selectedStudent.id}`, {
        method: 'DELETE', headers
      });
      if (res.ok) {
        setIsDeleteConfirmOpen(false);
        fetchStudents();
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  // ── Form fields shared JSX ─────────────────────────────────
  const StudentFormFields = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
          <input required className="input-field" placeholder="Ex: Amadou" value={data.firstName}
            onChange={e => onChange({...data, firstName: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom</label>
          <input required className="input-field" placeholder="Ex: ZONGO" value={data.lastName}
            onChange={e => onChange({...data, lastName: e.target.value})} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email (Parent)</label>
        <input type="email" required className="input-field" placeholder="amadou@parent.bf" value={data.email}
          onChange={e => onChange({...data, email: e.target.value})} />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Téléphone Parent</label>
        <input type="tel" className="input-field" placeholder="+226 70 00 00 00" value={data.phone || ''}
          onChange={e => onChange({...data, phone: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date de Naissance</label>
          <input type="date" required className="input-field" value={data.dateOfBirth}
            onChange={e => onChange({...data, dateOfBirth: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Genre</label>
          <select className="input-field" value={data.gender}
            onChange={e => onChange({...data, gender: e.target.value})}>
            <option>Garçon</option>
            <option>Fille</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Classe</label>
        <select required className="input-field" value={data.classId}
          onChange={e => onChange({...data, classId: e.target.value})}>
          <option value="">Sélectionner une classe</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name} ({cls.cycle})</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-brand-500" size={30} />
            Gestion des Élèves
          </h2>
          <p className="text-slate-500 mt-2 font-medium">{filtered.length} élève(s) — Page {currentPage}/{totalPages}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm">
            <FileDown className="w-4 h-4" /> Exporter (CSV)
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <UserPlus className="w-4 h-4 mr-1" /> Nouveau Dossier
          </button>
        </div>
      </div>

      {/* ── Modal Création ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau dossier élève">
        <form onSubmit={handleSubmit} className="space-y-4">
          <StudentFormFields data={formData} onChange={setFormData} />
          <button type="submit" disabled={isSubmitting} className="w-full btn-primary h-12 mt-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enregistrer le Dossier'}
          </button>
        </form>
      </Modal>

      {/* ── Modal Modification ── */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Modifier — ${selectedStudent?.user?.firstName} ${selectedStudent?.user?.lastName}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <StudentFormFields data={editData} onChange={setEditData} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-amber-200 transition-all mt-2">
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
            <p className="font-bold text-slate-800">Voulez-vous vraiment supprimer le dossier de</p>
            <p className="text-rose-600 font-black text-lg mt-1">{selectedStudent?.user?.firstName} {selectedStudent?.user?.lastName}</p>
            <p className="text-slate-500 text-sm mt-2">Cette action est irréversible. Toutes les notes et paiements liés seront supprimés.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteConfirmOpen(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold h-11 rounded-2xl transition-all">
              Annuler
            </button>
            <button onClick={handleDelete} disabled={isSubmitting}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 rounded-2xl shadow-lg shadow-rose-200 transition-all">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Supprimer définitivement'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Barre de recherche + Filtres ── */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        {/* Recherche */}
        <div className="flex-1 relative bg-white border border-slate-200 rounded-xl shadow-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
          <input type="text" placeholder="Rechercher un élève (nom, matricule)…"
            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm outline-none font-medium placeholder-slate-400" />
        </div>

        {/* Filtre Classe */}
        <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
          <option value="">Toutes les classes</option>
          {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>

        {/* Filtre Genre */}
        <select value={filterGender} onChange={e => { setFilterGender(e.target.value); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
          <option value="">Tous les genres</option>
          <option value="Garçon">Garçon</option>
          <option value="Fille">Fille</option>
        </select>

        {/* Filtre Statut */}
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none">
          <option value="">Tous les statuts</option>
          <option value="En règle">En règle</option>
          <option value="Impayé">Impayé</option>
          <option value="En attente">En attente</option>
        </select>

        {/* Reset */}
        {(filterClass || filterGender || filterStatus) && (
          <button onClick={() => { setFilterClass(''); setFilterGender(''); setFilterStatus(''); setCurrentPage(1); }}
            className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors">
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Élève</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Classe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Genre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Parent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                  Aucun élève trouvé pour ces filtres.
                </td></tr>
              ) : paginated.map((student) => (
                <tr key={student.id} className="hover:bg-brand-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img className="h-9 w-9 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200"
                        src={student.user?.avatarUrl || `https://ui-avatars.com/api/?name=${student.user?.firstName}+${student.user?.lastName}&background=6366f1&color=fff`} alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {student.user?.lastName?.toUpperCase()} {student.user?.firstName}
                        </div>
                        <div className="text-xs text-slate-400">{student.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">
                      {student.enrollmentId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                      {student.class?.name || <span className="text-slate-400 font-normal italic">Non assigné</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student.gender === 'Fille' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                      {student.gender || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">{student.parentName || student.user?.firstName + ' ' + student.user?.lastName}</span>
                      <span className="text-xs text-slate-400">{student.user?.phone || 'Tél. non renseigné'}</span>
                      <span className="text-xs text-slate-400">{student.user?.email || ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status || 'En règle'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center gap-1">
                      {/* Bulletin PDF */}
                      <button title="Télécharger le bulletin"
                        onClick={() => window.open(`${API_URL}/school/report-card/${student.id}/Trimestre_1?token=${token}`, '_blank')}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                        <FileDown className="w-4 h-4" />
                      </button>
                      {/* Modifier */}
                      <button title="Modifier le dossier" onClick={() => openEdit(student)}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Supprimer */}
                      <button title="Supprimer le dossier" onClick={() => openDelete(student)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Affichage de <span className="font-bold text-slate-900">{Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}</span>
            {' '}à <span className="font-bold text-slate-900">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span>
            {' '}sur <span className="font-bold text-slate-900">{filtered.length}</span> élève(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            {/* Numéros de pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) => p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
              ) : (
                <button key={p} onClick={() => handlePageChange(p as number)}
                  className={`w-8 h-8 text-sm font-bold rounded-lg transition-all ${currentPage === p ? 'bg-brand-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))
            }
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'En règle') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
      <CheckCircle2 className="w-3.5 h-3.5" />{status}
    </span>
  );
  if (status === 'Impayé') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
      <XCircle className="w-3.5 h-3.5" />{status}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />{status}
    </span>
  );
}
