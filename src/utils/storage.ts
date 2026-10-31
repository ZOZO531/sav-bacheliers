// Gestion du stockage local (localStorage)
// Les données sont sauvegardées directement sur le téléphone

import { AppConfig, Bachelier } from '../types';

const STORAGE_KEY = 'sav_bacheliers_data';

// Générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function defaultData(): AppConfig {
  return { annee: new Date().getFullYear().toString(), bacheliers: [] };
}

// Vérifie et nettoie des données (stockage ou fichier de sauvegarde importé)
export function normalizeData(raw: unknown): AppConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.bacheliers)) return null;

  const bacheliers: Bachelier[] = o.bacheliers.map((item, i) => {
    const b = (item ?? {}) as Record<string, unknown>;
    const pts = Number(b.points);
    return {
      id: typeof b.id === 'string' && b.id ? b.id : generateId(),
      numero: i + 1,
      nomPrenoms: String(b.nomPrenoms ?? ''),
      cgqCgv: String(b.cgqCgv ?? ''),
      bac: String(b.bac ?? ''),
      points: Number.isFinite(pts) ? Math.min(1000, Math.max(0, pts)) : 0,
      etablissement: String(b.etablissement ?? ''),
      telParents: String(b.telParents ?? ''),
      telEleves: String(b.telEleves ?? ''),
    };
  });

  const annee = o.annee ? String(o.annee) : new Date().getFullYear().toString();
  return { annee, bacheliers };
}

// Charger les données depuis le téléphone
export function loadData(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const clean = normalizeData(JSON.parse(raw));
      if (clean) return clean;
    }
  } catch (e) {
    console.error('Erreur de chargement:', e);
  }
  return defaultData();
}

// Sauvegarder les données sur le téléphone
export function saveData(data: AppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erreur de sauvegarde:', e);
  }
}

// Demande au navigateur de ne pas effacer les données automatiquement
export function requestPersistentStorage(): void {
  try {
    navigator.storage?.persist?.();
  } catch {
    /* ignoré */
  }
}

// Ajouter un bachelier
export function addBachelier(data: AppConfig, bachelier: Omit<Bachelier, 'id' | 'numero'>): AppConfig {
  const newBachelier: Bachelier = {
    ...bachelier,
    id: generateId(),
    numero: data.bacheliers.length + 1,
  };
  return { ...data, bacheliers: [...data.bacheliers, newBachelier] };
}

// Modifier un bachelier
export function updateBachelier(data: AppConfig, id: string, updates: Partial<Bachelier>): AppConfig {
  return {
    ...data,
    bacheliers: data.bacheliers.map(b => (b.id === id ? { ...b, ...updates } : b)),
  };
}

// Supprimer un bachelier puis re-numéroter
export function deleteBachelier(data: AppConfig, id: string): AppConfig {
  const filtered = data.bacheliers.filter(b => b.id !== id);
  const renumbered = filtered.map((b, i) => ({ ...b, numero: i + 1 }));
  return { ...data, bacheliers: renumbered };
}
