import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    totalRevenue: number;
    avgRating: number;
    completionRate: number;
    growthRate: number;
  };
  monthlyData: {
    month: string;
    students: number;
    revenue: number;
    sessions: number;
    completion: number;
  }[];
  topRoutines: {
    id: string;
    name: string;
    students: number;
    completion: number;
    rating: number;
  }[];
  studentProgress: {
    id: string;
    name: string;
    progress: number;
    lastActive: string;
    routine: string;
  }[];
  revenueBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export const exportToPDF = (data: AnalyticsData, title: string = 'Reporte de Analytics') => {
  const doc = new jsPDF();
  
  // Configuración inicial
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Título
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(title, margin, yPosition);
  yPosition += 15;

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, margin, yPosition);
  yPosition += 20;

  // Métricas principales
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Métricas Principales', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Alumnos: ${data.overview.totalStudents}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Alumnos Activos: ${data.overview.activeStudents}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Ingresos Totales: $${data.overview.totalRevenue.toLocaleString('es-AR')}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Rating Promedio: ${data.overview.avgRating}/5`, margin, yPosition);
  yPosition += 7;
  doc.text(`Tasa de Completación: ${data.overview.completionRate}%`, margin, yPosition);
  yPosition += 7;
  doc.text(`Tasa de Crecimiento: ${data.overview.growthRate}%`, margin, yPosition);
  yPosition += 20;

  // Datos mensuales
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Datos Mensuales', margin, yPosition);
  yPosition += 10;

  // Tabla de datos mensuales
  const tableHeaders = ['Mes', 'Alumnos', 'Ingresos', 'Sesiones', 'Completación'];
  const tableData = data.monthlyData.map(row => [
    row.month,
    row.students.toString(),
    `$${row.revenue.toLocaleString('es-AR')}`,
    row.sessions.toString(),
    `${row.completion}%`
  ]);

  // Dibujar tabla
  const cellWidth = (pageWidth - 2 * margin) / tableHeaders.length;
  const cellHeight = 10;

  // Headers
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(59, 130, 246); // Blue
  tableHeaders.forEach((header, index) => {
    doc.rect(margin + index * cellWidth, yPosition, cellWidth, cellHeight, 'F');
    doc.text(header, margin + index * cellWidth + 2, yPosition + 7);
  });
  yPosition += cellHeight;

  // Data rows
  doc.setTextColor(0, 0, 0);
  tableData.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin + cellIndex * cellWidth, yPosition, cellWidth, cellHeight, 'F');
      }
      doc.text(cell, margin + cellIndex * cellWidth + 2, yPosition + 7);
    });
    yPosition += cellHeight;
  });
  yPosition += 15;

  // Rutinas principales
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Rutinas con Mejor Rendimiento', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  data.topRoutines.forEach((routine, index) => {
    doc.text(`${index + 1}. ${routine.name}`, margin, yPosition);
    yPosition += 6;
    doc.text(`   Alumnos: ${routine.students} | Completación: ${routine.completion}% | Rating: ${routine.rating}`, margin + 5, yPosition);
    yPosition += 8;
  });

  // Guardar PDF
  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportToExcel = (data: AnalyticsData, filename: string = 'analytics_export') => {
  const workbook = XLSX.utils.book_new();

  // Hoja de métricas principales
  const metricsData = [
    ['Métrica', 'Valor'],
    ['Total Alumnos', data.overview.totalStudents],
    ['Alumnos Activos', data.overview.activeStudents],
    ['Ingresos Totales', data.overview.totalRevenue],
    ['Rating Promedio', data.overview.avgRating],
    ['Tasa de Completación', data.overview.completionRate],
    ['Tasa de Crecimiento', data.overview.growthRate],
  ];
  const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas');

  // Hoja de datos mensuales
  const monthlyData = [
    ['Mes', 'Alumnos', 'Ingresos', 'Sesiones', 'Completación'],
    ...data.monthlyData.map(row => [
      row.month,
      row.students,
      row.revenue,
      row.sessions,
      row.completion
    ])
  ];
  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Datos Mensuales');

  // Hoja de rutinas principales
  const routinesData = [
    ['Nombre', 'Alumnos', 'Completación', 'Rating'],
    ...data.topRoutines.map(row => [
      row.name,
      row.students,
      row.completion,
      row.rating
    ])
  ];
  const routinesSheet = XLSX.utils.aoa_to_sheet(routinesData);
  XLSX.utils.book_append_sheet(workbook, routinesSheet, 'Rutinas');

  // Hoja de progreso de alumnos
  const progressData = [
    ['Nombre', 'Progreso', 'Última Actividad', 'Rutina'],
    ...data.studentProgress.map(row => [
      row.name,
      row.progress,
      row.lastActive,
      row.routine
    ])
  ];
  const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
  XLSX.utils.book_append_sheet(workbook, progressSheet, 'Progreso');

  // Hoja de distribución de ingresos
  const revenueData = [
    ['Categoría', 'Monto', 'Porcentaje'],
    ...data.revenueBreakdown.map(row => [
      row.category,
      row.amount,
      row.percentage
    ])
  ];
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Ingresos');

  // Generar y descargar archivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${Date.now()}.xlsx`);
};

export const exportToCSV = (data: AnalyticsData, filename: string = 'analytics_export') => {
  // Combinar todos los datos en un solo CSV
  let csvContent = '';

  // Métricas principales
  csvContent += '=== MÉTRICAS PRINCIPALES ===\n';
  csvContent += 'Métrica,Valor\n';
  csvContent += `Total Alumnos,${data.overview.totalStudents}\n`;
  csvContent += `Alumnos Activos,${data.overview.activeStudents}\n`;
  csvContent += `Ingresos Totales,${data.overview.totalRevenue}\n`;
  csvContent += `Rating Promedio,${data.overview.avgRating}\n`;
  csvContent += `Tasa de Completación,${data.overview.completionRate}\n`;
  csvContent += `Tasa de Crecimiento,${data.overview.growthRate}\n\n`;

  // Datos mensuales
  csvContent += '=== DATOS MENSUALES ===\n';
  csvContent += 'Mes,Alumnos,Ingresos,Sesiones,Completación\n';
  data.monthlyData.forEach(row => {
    csvContent += `${row.month},${row.students},${row.revenue},${row.sessions},${row.completion}\n`;
  });
  csvContent += '\n';

  // Rutinas principales
  csvContent += '=== RUTINAS PRINCIPALES ===\n';
  csvContent += 'Nombre,Alumnos,Completación,Rating\n';
  data.topRoutines.forEach(row => {
    csvContent += `${row.name},${row.students},${row.completion},${row.rating}\n`;
  });
  csvContent += '\n';

  // Progreso de alumnos
  csvContent += '=== PROGRESO DE ALUMNOS ===\n';
  csvContent += 'Nombre,Progreso,Última Actividad,Rutina\n';
  data.studentProgress.forEach(row => {
    csvContent += `${row.name},${row.progress},${row.lastActive},${row.routine}\n`;
  });
  csvContent += '\n';

  // Distribución de ingresos
  csvContent += '=== DISTRIBUCIÓN DE INGRESOS ===\n';
  csvContent += 'Categoría,Monto,Porcentaje\n';
  data.revenueBreakdown.forEach(row => {
    csvContent += `${row.category},${row.amount},${row.percentage}\n`;
  });

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}_${Date.now()}.csv`);
};

interface ProgressItem {
  ejercicio?: string;
  nombreEjercicio?: string;
  seriesRealizadas?: Array<{ peso: number; reps: number }>;
  series?: Array<{ peso: number; reps: number }>;
}

export const exportStudentProgressToPDF = (studentName: string, progressData: ProgressItem[]) => {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Título
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(`Progreso: ${studentName}`, margin, yPosition);
  yPosition += 15;

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, margin, yPosition);
  yPosition += 20;

  // Datos de progreso
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  progressData.forEach((item, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(11);
    doc.text(`${index + 1}. ${item.ejercicio || item.nombreEjercicio}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    if (item.seriesRealizadas && item.seriesRealizadas.length > 0) {
      item.seriesRealizadas.forEach((serie, sIndex: number) => {
        doc.text(`   Serie ${sIndex + 1}: ${serie.peso}kg x ${serie.reps} reps`, margin + 5, yPosition);
        yPosition += 6;
      });
    } else if (item.series && item.series.length > 0) {
      item.series.forEach((serie, sIndex: number) => {
        doc.text(`   Serie ${sIndex + 1}: ${serie.peso}kg x ${serie.reps} reps`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
    yPosition += 5;
  });

  doc.save(`progreso_${studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};
