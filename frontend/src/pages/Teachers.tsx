import { useState, useEffect } from 'react';
import { GraduationCap, Mail, Phone, Calendar, MoreVertical, Plus, Users as UsersIcon } from 'lucide-react';
import API_URL from '../config';

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/school/teachers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setTeachers(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-brand-500" size={32} />
            Corps Enseignant
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Gérez les profils, les spécialités et les emplois du temps des professeurs.</p>
        </div>
        <button className="btn-primary group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Ajouter un Professeur</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-brand-50 p-3 rounded-xl text-brand-600">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold">Total Professeurs</p>
            <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-semibold">En Cours de Cours</p>
            <p className="text-2xl font-black text-slate-900">22</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {teachers.length === 0 && <div className="text-slate-500 col-span-2">Aucun professeur trouvé.</div>}
        {teachers.map((teacher) => {
          const tName = `${teacher.user?.firstName} ${teacher.user?.lastName}`;
          return (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-6 relative overflow-hidden group">
            <img src={teacher.user?.avatarUrl || `https://ui-avatars.com/api/?name=${teacher.user?.firstName}+${teacher.user?.lastName}&background=0284c7&color=fff`} alt={tName} className="w-24 h-24 rounded-2xl shadow-lg border-2 border-white object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{tName}</h3>
                  <p className="text-brand-500 font-bold text-sm">{teacher.specialty}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  {teacher.user?.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  {teacher.user?.phone || 'Non spécifié'}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {teacher.classes?.map((c: any) => (
                  <span key={c.id} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase border border-slate-200">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            {/* Background design element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-50/50 rounded-full blur-2xl group-hover:bg-brand-100/70 transition-all duration-500"></div>
          </div>
        )})}
      </div>
    </div>
  );
}

