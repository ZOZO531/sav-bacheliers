// Types de l'application SAV - Fiche d'enregistrement des Bacheliers

export interface Bachelier {
  id: string;
  numero: number;
  nomPrenoms: string;
  cgqCgv: string;
  bac: string;
  points: number;
  etablissement: string;
  telParents: string;
  telEleves: string;
}

export interface AppConfig {
  annee: string;
  bacheliers: Bachelier[];
}

export type ViewMode = 'table' | 'chart' | 'export';
