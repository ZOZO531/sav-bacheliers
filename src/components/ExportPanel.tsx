import { AppConfig } from '../types';
import {
  exportToPDF, exportToExcel, exportToWord, exportToPowerPoint, exportToAccess, exportBackup,
} from '../utils/export';
import { normalizeData } from '../utils/storage';
import { FileText, Table, FileSpreadsheet, Presentation, Database, Download, Save, Upload } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

interface Props {
  data: AppConfig;
  onImport: (data: AppConfig) => void;
}

export default function ExportPanel({ data, onImport }: Props) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async (type: string, fn: () => Promise<void>) => {
    setExporting(type);
    setMessage(null);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setMessage({ ok: false, text: "Échec de l'export. Réessayez (internet nécessaire la toute première fois)." });
    } finally {
      setExporting(null);
    }
  };

  const handleRestore = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const clean = normalizeData(JSON.parse(await file.text()));
      if (!clean) throw new Error('format');
      if (!window.confirm(`Remplacer les données actuelles par ${clean.bacheliers.length} bachelier(s) (année ${clean.annee}) ?`)) return;
      onImport(clean);
      setMessage({ ok: true, text: 'Sauvegarde restaurée.' });
    } catch {
      setMessage({ ok: false, text: 'Fichier de sauvegarde invalide.' });
    }
  };

  const exportButtons = [
    { type: 'pdf', label: 'PDF', ext: '.pdf', icon: FileText, color: 'from-red-500 to-red-600', fn: () => exportToPDF(data) },
    { type: 'excel', label: 'Excel', ext: '.xlsx', icon: Table, color: 'from-green-500 to-green-600', fn: () => exportToExcel(data) },
    { type: 'word', label: 'Word', ext: '.docx', icon: FileSpreadsheet, color: 'from-blue-500 to-blue-600', fn: () => exportToWord(data) },
    { type: 'ppt', label: 'PowerPoint', ext: '.pptx', icon: Presentation, color: 'from-orange-500 to-orange-600', fn: () => exportToPowerPoint(data) },
    { type: 'access', label: 'Access (CSV)', ext: '.csv, importable dans Access', icon: Database, color: 'from-purple-500 to-purple-600', fn: () => exportToAccess(data) },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg">
        <h2 className="text-lg font-bold text-center">📤 Exporter les données</h2>
        <p className="text-center text-orange-100 text-sm mt-1">
          Année {data.annee} • {data.bacheliers.length} bacheliers
        </p>
      </div>

      {message && (
        <div className={`rounded-xl p-3 text-sm font-medium ${message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {data.bacheliers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">Aucune donnée à exporter</p>
          <p className="text-sm">Enregistrez des bacheliers d'abord</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {exportButtons.map(({ type, label, ext, icon: Icon, color, fn }) => (
              <button
                key={type}
                onClick={() => run(type, fn)}
                disabled={exporting !== null}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50`}
              >
                <div className="p-2 bg-white/20 rounded-xl">
                  <Icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-base">Exporter en {label}</p>
                  <p className="text-white/70 text-xs">Fichier {ext}</p>
                </div>
                {exporting === type ? (
                  <div className="animate-spin"><Download size={20} /></div>
                ) : (
                  <Download size={20} />
                )}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-700 mb-2">📋 Résumé :</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2">
                <span className="text-gray-500">Année :</span>
                <span className="font-bold ml-1">{data.annee}</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-gray-500">Total :</span>
                <span className="font-bold ml-1">{data.bacheliers.length}</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-gray-500">Moy. Points :</span>
                <span className="font-bold ml-1">
                  {(data.bacheliers.reduce((s, b) => s + b.points, 0) / data.bacheliers.length).toFixed(1)}
                </span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-gray-500">Max Points :</span>
                <span className="font-bold ml-1">{Math.max(...data.bacheliers.map(b => b.points))}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sauvegarde / restauration */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-3">
        <p className="text-sm font-bold text-blue-800">💾 Sauvegarde de sécurité</p>
        <p className="text-xs text-blue-700">
          Les données sont uniquement sur ce téléphone. Faites une sauvegarde régulièrement et gardez le fichier (WhatsApp, e-mail, Drive).
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => run('backup', () => exportBackup(data))}
            disabled={exporting !== null}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 active:scale-95 transition-all"
          >
            <Save size={16} /> Sauvegarder
          </button>
          <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-blue-600 text-blue-700 text-sm font-semibold cursor-pointer active:scale-95 transition-all">
            <Upload size={16} /> Restaurer
            <input type="file" accept=".json,application/json" className="hidden" onChange={handleRestore} />
          </label>
        </div>
      </div>
    </div>
  );
}
