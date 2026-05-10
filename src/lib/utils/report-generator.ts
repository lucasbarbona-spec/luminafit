import type { ProgresoSemana, EjercicioAnalisis } from '@/types';

export const generateProgressReport = (
  semanasData: ProgresoSemana[]
): EjercicioAnalisis[] => {
  const ejerciciosMap = new Map<string, EjercicioAnalisis>();

  semanasData.forEach((semana) => {
    semana.ejercicios.forEach((progreso) => {
      if (!ejerciciosMap.has(progreso.nombreEjercicio)) {
        ejerciciosMap.set(progreso.nombreEjercicio, {
          id: progreso.ejercicioId,
          nombre: progreso.nombreEjercicio,
          nombreEjercicio: progreso.nombreEjercicio,
          cargaInicial: '',
          cargaFinal: '',
          progreso: 0,
          tendencia: 'mantenido',
          volumenTotal: 0,
          frecuencia: 0,
        });
      }

      const analisis = ejerciciosMap.get(progreso.nombreEjercicio)!;

      if (progreso.seriesRealizadas.length > 0) {
        const ultimaSerie =
          progreso.seriesRealizadas[progreso.seriesRealizadas.length - 1];

        if (!analisis.cargaInicial) {
          analisis.cargaInicial = ultimaSerie.peso.toString();
        }
        analisis.cargaFinal = ultimaSerie.peso.toString();
      }
    });
  });

  // Calcular progreso
  return Array.from(ejerciciosMap.values()).map((analisis) => {
    if (analisis.cargaInicial && analisis.cargaFinal) {
      const inicial = parseFloat(analisis.cargaInicial) || 0;
      const final = parseFloat(analisis.cargaFinal) || 0;
      const cambio = ((final - inicial) / inicial) * 100 || 0;

      return {
        ...analisis,
        progreso: Math.round(cambio),
        tendencia:
          cambio > 5
            ? 'mejorado'
            : cambio < -5
              ? 'bajó'
              : 'mantenido',
      };
    }
    return analisis;
  });
};

export const formatReportAsText = (
  alumnoNombre: string,
  analisis: EjercicioAnalisis[]
): string => {
  let report = `📊 REPORTE DE PROGRESO - ${alumnoNombre}\n`;
  report += `${'='.repeat(40)}\n\n`;

  analisis.forEach((ejercicio) => {
    report += `${ejercicio.nombreEjercicio}\n`;
    report += `  Carga Inicial: ${ejercicio.cargaInicial}\n`;
    report += `  Carga Final: ${ejercicio.cargaFinal}\n`;
    report += `  Progreso: ${ejercicio.progreso}% - ${ejercicio.tendencia.toUpperCase()}\n\n`;
  });

  return report;
};