import { Bachelier } from '../types';
import { Edit3, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
  bacheliers: Bachelier[];
  annee: string;
  onEdit: (bachelier: Bachelier) => void;
  onDelete: (id: string) => void;
}

export default function StudentTable({ bacheliers, annee, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = bacheliers.filter(b =>
    b.nomPrenoms.toLowerCase().includes(search.toLowerCase()) ||
    b.etablissement.toLowerCase().includes(search.toLowerCase()) ||
    b.bac.toLowerCase().includes(search.toLowerCase()) ||
    b.cgqCgv.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête du tableau */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
        <h2 className="text-lg font-bold text-center">
          📋 Fiche d'enregistrement des Bacheliers
        </h2>
        <p className="text-center text-blue-100 text-sm mt-1">
          Année {annee}
        </p>
        <p className="text-center text-blue-200 text-xs mt-1">
          {bacheliers.length} bachelier{bacheliers.length > 1 ? 's' : ''} enregistré{bacheliers.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, établissement, série..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">
            {bacheliers.length === 0 ? 'Aucun bachelier enregistré' : 'Aucun résultat'}
          </p>
          <p className="text-sm">
            {bacheliers.length === 0 ? 'Appuyez sur + pour ajouter' : 'Essayez une autre recherche'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                <th className="px-2 py-3 text-left font-bold text-gray-700 whitespace-nowrap">N°</th>
                <th className="px-2 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Nom & Prénoms</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">CGQ/CGV</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">BAC</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">PTS</th>
                <th className="px-2 py-3 text-left font-bold text-gray-700 whitespace-nowrap">ÉTABLISSEMENT</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">T.PAR</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">T.ÉLV</th>
                <th className="px-2 py-3 text-center font-bold text-gray-700 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, idx) => (
                <tr key={b.id} className={`border-t border-gray-100 hover:bg-blue-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-2 py-2.5 font-bold text-blue-600">{b.numero}</td>
                  <td className="px-2 py-2.5 font-medium text-gray-800 max-w-[120px] truncate">{b.nomPrenoms}</td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium text-[10px]">
                      {b.cgqCgv || '-'}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium text-[10px]">
                      {b.bac || '-'}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center font-bold text-orange-600">{b.points}</td>
                  <td className="px-2 py-2.5 text-gray-600 max-w-[100px] truncate">{b.etablissement || '-'}</td>
                  <td className="px-2 py-2.5 text-center text-gray-500 text-[10px]">{b.telParents || '-'}</td>
                  <td className="px-2 py-2.5 text-center text-gray-500 text-[10px]">{b.telEleves || '-'}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEdit(b)}
                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                        <Edit3 size={12} />
                      </button>
                      <button onClick={() => handleDelete(b.id)}
                        className={`p-1.5 rounded-lg transition-colors ${confirmDelete === b.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
