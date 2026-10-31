import { useState, useEffect } from 'react';
import { AppConfig, Bachelier, ViewMode } from './types';
import { loadData, saveData, requestPersistentStorage, addBachelier, updateBachelier, deleteBachelier } from './utils/storage';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import ChartView from './components/ChartView';
import ExportPanel from './components/ExportPanel';
import { Table2, BarChart3, Download, Plus, Settings } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppConfig>(loadData);
  const [view, setView] = useState<ViewMode>('table');
  const [showForm, setShowForm] = useState(false);
  const [editBachelier, setEditBachelier] = useState<Bachelier | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempAnnee, setTempAnnee] = useState(data.annee);

  // Sauvegarder automatiquement à chaque modification
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Demander au téléphone de conserver les données
  useEffect(() => {
    requestPersistentStorage();
  }, []);

  // Handlers CRUD
  const handleAdd = (formData: Omit<Bachelier, 'id' | 'numero'>) => {
    setData(prev => addBachelier(prev, formData));
    setShowForm(false);
  };

  const handleUpdate = (formData: Omit<Bachelier, 'id' | 'numero'>) => {
    if (editBachelier) {
      setData(prev => updateBachelier(prev, editBachelier.id, formData));
      setEditBachelier(null);
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setData(prev => deleteBachelier(prev, id));
  };

  const handleEdit = (bachelier: Bachelier) => {
    setEditBachelier(bachelier);
    setShowForm(true);
  };

  const handleAnneeChange = () => {
    const annee = tempAnnee.trim();
    if (annee) setData(prev => ({ ...prev, annee }));
    setShowSettings(false);
  };

  const navItems = [
    { id: 'table' as ViewMode, icon: Table2, label: 'Tableau' },
    { id: 'chart' as ViewMode, icon: BarChart3, label: 'Graphique' },
    { id: 'export' as ViewMode, icon: Download, label: 'Export' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">SAV</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm leading-tight">SAV Bacheliers</h1>
              <p className="text-[10px] text-gray-400">Année {data.annee}</p>
            </div>
          </div>
          <button onClick={() => { setTempAnnee(data.annee); setShowSettings(true); }}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Settings size={20} className="text-gray-500" />
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {view === 'table' && (
          <StudentTable
            bacheliers={data.bacheliers}
            annee={data.annee}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {view === 'chart' && (
          <ChartView bacheliers={data.bacheliers} annee={data.annee} />
        )}
        {view === 'export' && (
          <ExportPanel data={data} onImport={setData} />
        )}
      </main>

      {/* Navigation bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-around">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                view === id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bouton FAB (ajout rapide) */}
      {view === 'table' && (
        <button
          onClick={() => { setEditBachelier(null); setShowForm(true); }}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all active:scale-90 flex items-center justify-center"
        >
          <Plus size={28} />
        </button>
      )}

      {/* Modal Formulaire */}
      {showForm && (
        <StudentForm
          onSubmit={editBachelier ? handleUpdate : handleAdd}
          onClose={() => { setShowForm(false); setEditBachelier(null); }}
          editData={editBachelier}
        />
      )}

      {/* Modal Paramètres (Année) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚙️ Paramètres</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Année scolaire
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-bold text-center"
                  value={tempAnnee}
                  onChange={e => setTempAnnee(e.target.value)}
                  placeholder="Ex: 2024-2025"
                />
              </div>

              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                <p className="text-xs text-yellow-700">
                  ⚠️ Changer l'année ne supprime pas les données existantes.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button onClick={handleAnneeChange}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
