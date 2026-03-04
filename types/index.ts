// ============================================================
// TIPOS GLOBALES — Mi Camino a la U
// Fuente: Brief "Panorama Educación Superior Chile 2026"
// ============================================================

export interface UserProfile {
  nombre: string;
  nem: string;          // 1.0 – 7.0
  ranking: string;      // 100 – 1000 pts
  lc: string;           // Competencia Lectora
  m1: string;           // Matemática 1
  m2: string;           // Matemática 2 (electiva)
  ciencias: string;     // Ciencias (electiva)
  historia: string;     // Historia y Cs. Sociales (electiva)
  rsh: string;          // % RSH (0 – 100)
  region: string;
  primeraGen: boolean;  // Primera generación universitaria
}

export interface Coeficientes {
  nem: number;
  ranking: number;
  lc: number;
  m1: number;
  m2: number;
  ciencias: number;
  historia: number;
}

export interface Carrera {
  id: string;
  nombre: string;
  nombre_search?: string;
  area: string;
  institucion: string;
  inst_search?: string;
  tipo: 'Universidad' | 'IP' | 'CFT';
  region: string;
  vacantes: number;
  corte2024: number;
  corte2023: number;
  coeficientes: Coeficientes;
  duracion: string;
  grado: string;
  arancel: number;          // Arancel real anual
  arancelReferencia: number; // Arancel de referencia (para brecha)
  acreditacion: number;     // años de acreditación
  gratuidad: boolean;
  // Fallbacks for Real API
  universidad?: string;
  sede?: string;
  sede_search?: string;
  jornada?: string;
  alerta_fne?: string;
  puntaje_corte?: number;
  corte2025?: number;
  corte2026?: number;
}

export interface Institucion {
  id: string;
  nombre: string;
  sigla: string;
  tipo: 'CRUCH' | 'Privada' | 'IP' | 'CFT';
  region: string;
  acreditacion: number;
  gratuidad: boolean;
  pace: boolean;
  link: string;
}

export interface Beneficio {
  id: string;
  nombre: string;
  categoria: 'Gratuidad' | 'Beca' | 'Crédito' | 'Apoyo';
  resumen: string;
  detalles: string;
  requisitosRSH: number;   // % máximo RSH requerido
  requisitoPuntaje: number; // puntaje mínimo PAES (0 = no aplica)
  requisitoNEM: number;    // NEM mínimo (0 = no aplica)
  montoEstimado: string;
  compatible: string[];    // IDs de beneficios compatibles
  instituciones: string;   // descripción de instituciones elegibles
  fuente: string;
  alerta?: string;
}

export interface CalendarioItem {
  id: string;
  mes: string;
  titulo: string;
  desc: string;
  estado: 'pasado' | 'activo' | 'pendiente';
  categoria: 'PAES' | 'Postulacion' | 'Becas' | 'Resultados' | 'Matricula';
  link: string;
  s?: string;
}

export interface ViaIngreso {
  id: string;
  nombre: string;
  icono: string;
  desc: string;
  requisitos: string[];
  fuente: string;
}

export type Screen =
  | 'dashboard'
  | 'paes'
  | 'carreras'
  | 'beneficios'
  | 'calendario';
