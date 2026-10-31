import React, { useState, useEffect } from 'react';
import { Bachelier } from '../types';
import { X } from 'lucide-react';

interface Props {
  onSubmit: (data: Omit<Bachelier, 'id' | 'numero'>) => void;
  onClose: () => void;
  editData?: Bachelier | null;
}

export default function StudentForm({ onSubmit, onClose, editData }: Props) {
  const [form, setForm] = useState({
    nomPrenoms: '',
    cgqCgv: '',
    bac: '',
    points: '',
    etablissement: '',
    telParents: '',
    telEleves: '',
  });

  useEffect(() => {
    if (editData) {
      setForm({
        nomPrenoms: editData.nomPrenoms,
        cgqCgv: editData.cgqCgv,
        bac: editData.bac,
        points: String(editData.points),
        etablissement: editData.etablissement,
        telParents: editData.telParents,
        telEleves: editData.telEleves,
      });
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomPrenoms.trim()) return;
    const pts = parseInt(form.points, 10);
    const points = Number.isNaN(pts) ? 0 : Math.min(1000, Math.max(0, pts));
    onSubmit({
      nomPrenoms: form.nomPrenoms.trim(),
      cgqCgv: form.cgqCgv.trim(),
      bac: form.bac.trim(),
      points,
      etablissement: form.etablissement.trim(),
      telParents: form.telParents.trim(),
      telEleves: form.telEleves.trim(),
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl sm:rounded-t-3xl px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {editData ? '✏️ Modifier le bachelier' : '➕ Nouveau bachelier'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Nom & Prénoms *</label>
            <input type="text" className={inputClass} placeholder="Ex: KOUASSI Jean Marc"
              value={form.nomPrenoms} onChange={e => setForm({ ...form, nomPrenoms: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>CGQ / CGV</label>
              <input type="text" className={inputClass} placeholder="Ex: A"
                value={form.cgqCgv} onChange={e => setForm({ ...form, cgqCgv: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>BAC (Série)</label>
              <input type="text" className={inputClass} placeholder="Ex: D, C, A4"
                value={form.bac} onChange={e => setForm({ ...form, bac: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Points</label>
            <input type="number" inputMode="numeric" className={inputClass} placeholder="Ex: 350" min="0" max="1000"
              value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} />
          </div>

          <div>
            <label className={labelClass}>Établissement</label>
            <input type="text" className={inputClass} placeholder="Ex: Lycée Classique d'Abidjan"
              value={form.etablissement} onChange={e => setForm({ ...form, etablissement: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Tel Parents</label>
              <input type="tel" className={inputClass} placeholder="Ex: 07 XX XX XX"
                value={form.telParents} onChange={e => setForm({ ...form, telParents: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Tel Élève</label>
              <input type="tel" className={inputClass} placeholder="Ex: 05 XX XX XX"
                value={form.telEleves} onChange={e => setForm({ ...form, telEleves: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
              {editData ? 'Modifier' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
