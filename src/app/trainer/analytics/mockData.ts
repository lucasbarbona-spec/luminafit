import type { AnalyticsData } from './page';

export const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalStudents: 156,
    activeStudents: 142,
    totalRevenue: 48500,
    avgRating: 4.8,
    completionRate: 89,
    growthRate: 12.5
  },
  monthlyData: [
    { month: 'Enero', students: 120, revenue: 35000, sessions: 480, completion: 85 },
    { month: 'Febrero', students: 135, revenue: 38000, sessions: 520, completion: 87 },
    { month: 'Marzo', students: 142, revenue: 41000, sessions: 560, completion: 88 },
    { month: 'Abril', students: 148, revenue: 43500, sessions: 590, completion: 89 },
    { month: 'Mayo', students: 152, revenue: 46000, sessions: 620, completion: 90 },
    { month: 'Junio', students: 156, revenue: 48500, sessions: 650, completion: 89 }
  ],
  topRoutines: [
    { id: '1', name: 'Rutina de Fuerza Avanzada', students: 45, completion: 92, rating: 4.9 },
    { id: '2', name: 'Cardio Intenso', students: 38, completion: 88, rating: 4.7 },
    { id: '3', name: 'Full Body Beginner', students: 32, completion: 95, rating: 4.8 },
    { id: '4', name: 'Yoga y Flexibilidad', students: 28, completion: 91, rating: 4.9 },
    { id: '5', name: 'HiIT Training', students: 25, completion: 85, rating: 4.6 }
  ],
  studentProgress: [
    { id: '1', name: 'Carlos Rodríguez', progress: 95, lastActive: 'Hoy', routine: 'Fuerza Avanzada' },
    { id: '2', name: 'Ana Martínez', progress: 88, lastActive: 'Ayer', routine: 'Cardio Intenso' },
    { id: '3', name: 'Luis Sánchez', progress: 82, lastActive: 'Hace 2 días', routine: 'Full Body' },
    { id: '4', name: 'Sofía López', progress: 78, lastActive: 'Hace 3 días', routine: 'Yoga' },
    { id: '5', name: 'María González', progress: 75, lastActive: 'Hace 4 días', routine: 'HiIT' }
  ],
  revenueBreakdown: [
    { category: 'Rutinas Personalizadas', amount: 28500, percentage: 58.8 },
    { category: 'Sesiones Grupales', amount: 12000, percentage: 24.7 },
    { category: 'Consultas Online', amount: 8000, percentage: 16.5 }
  ]
};
