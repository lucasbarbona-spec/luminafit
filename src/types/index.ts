export interface Alumno {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fechaInicio: Date;
  estado: 'activo' | 'inactivo' | 'paused';
  objetivos: string[];
  notas?: string;
  fotoUrl?: string;
  fechaNacimiento?: Date;
  genero?: 'masculino' | 'femenino' | 'otro';
  altura?: number;
  peso?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ejercicio {
  id: string;
  nombre: string;
  videoUrl?: string;
  series: number;
  repeticiones: string;
  intensidad: string;
  pause: number;
  pausa?: number;
  notas?: string;
  musculosPrincipales?: string[];
  equipo?: string;
}

export interface Bloque {
  id: string;
  nombre: string;
  ejercicios: Ejercicio[];
  orden: number;
}

export interface Rutina {
  id: string;
  nombre: string;
  descripcion?: string;
  semanas: number;
  estado: 'activa' | 'completada' | 'pausada';
  bloques: Bloque[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgresoEjercicio {
  id: string;
  ejercicioId: string;
  rutinaId: string;
  alumnoId: string;
  semana: number;
  dia: number;
  series: Array<{
    serie: number;
    reps: number;
    peso: number;
    completado: boolean;
  }>;
  notas?: string;
  createdAt: Date;
}

export interface Trainer {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  especialidad?: string[];
  certificaciones?: string[];
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'trainer' | 'client' | 'admin';
}

export interface ProgresoSemana {
  semana: number;
  ejercicios: ProgresoEjercicio[];
  fecha: Date;
  completado: boolean;
}

export interface ProgresoEjercicioDetalle {
  ejercicioId: string;
  nombreEjercicio: string;
  series: SerieProgreso[];
  seriesRealizadas: SerieProgreso[];
  pesoTotal: number;
  repsTotal: number;
  completado: boolean;
}

export interface SerieProgreso {
  serie: number;
  reps: number;
  peso: number;
  completado: boolean;
}

export interface EjercicioAnalisis {
  id: string;
  nombre: string;
  nombreEjercicio: string;
  progreso: ProgresoData[] | number;
  tendencia: 'mejorando' | 'disminuyendo' | 'estable' | 'mejorado' | 'bajó' | 'mantenido';
  volumenTotal: number;
  frecuencia: number;
  cargaInicial?: string;
  cargaFinal?: string;
}

export interface ProgresoData {
  fecha: Date;
  peso: number;
  reps: number;
  volumen: number; // peso * reps
}

// Marketplace y Productos
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  categoria: 'rutina' | 'plan' | 'suplemento' | 'equipamiento' | 'otro';
  imagenUrl?: string;
  activo: boolean;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Oferta {
  id: string;
  productoId: string;
  descuento: number; // porcentaje
  precioOferta: number;
  fechaInicio: Date;
  fechaFin: Date;
  activa: boolean;
  createdAt: Date;
}

// Pagos y Suscripciones
export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  frecuencia: 'mensual' | 'trimestral' | 'anual' | 'unico';
  caracteristicas?: string[];
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Suscripcion {
  id: string;
  alumnoId: string;
  planId: string;
  planNombre: string;
  precio: number;
  moneda: string;
  frecuencia: 'mensual' | 'trimestral' | 'anual';
  estado: 'activa' | 'pendiente' | 'cancelada' | 'vencida';
  fechaInicio: Date;
  fechaProximoPago: Date;
  metodoPago: 'mercado_pago' | 'transferencia' | 'efectivo' | 'otro';
  mercadoPagoPreferenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pago {
  id: string;
  suscripcionId: string;
  alumnoId: string;
  monto: number;
  moneda: string;
  fecha: Date;
  metodoPago: 'mercado_pago' | 'transferencia' | 'efectivo' | 'otro';
  estado: 'completado' | 'pendiente' | 'fallido' | 'reembolsado';
  mercadoPagoPaymentId?: string;
  mercadoPagoStatus?: string;
  notas?: string;
  createdAt: Date;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}
