'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface WeekProgressProps {
  rutinaId: string;
  semana: number;
  alumnoId: string;
}

const WeekProgress = ({
  rutinaId,
  semana,
  alumnoId
}: WeekProgressProps) => {
  // Datos de ejemplo - en producción vendrían de Firebase
  const progressData = {
    totalEjercicios: 12,
    ejerciciosCompletados: 8,
    totalSeries: 36,
    seriesCompletadas: 28,
    tiempoTotal: 45, // minutos
    progresoPorcentaje: 67
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Progreso Semana {semana}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">{progressData.progresoPorcentaje}%</div>
              <div className="text-sm text-gray-600">Progreso Total</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-success-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-success-600">{progressData.ejerciciosCompletados}/{progressData.totalEjercicios}</div>
              <div className="text-sm text-gray-600">Ejercicios</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <Clock className="w-8 h-8 text-warning-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-warning-600">{progressData.tiempoTotal}m</div>
              <div className="text-sm text-gray-600">Tiempo Total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span key="label">Progreso Semanal</span>
              <span key="percentage">{progressData.progresoPorcentaje}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressData.progresoPorcentaje}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Series Completadas</div>
              <div className="text-xl font-bold text-gray-900">{progressData.seriesCompletadas}/{progressData.totalSeries}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Ejercicios Completados</div>
              <div className="text-xl font-bold text-gray-900">{progressData.ejerciciosCompletados}/{progressData.totalEjercicios}</div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={progressData.progresoPorcentaje === 100 ? "success" : progressData.progresoPorcentaje >= 50 ? "warning" : "error"}
              size="lg"
            >
              {progressData.progresoPorcentaje === 100 ? 'Semana Completada' : 
               progressData.progresoPorcentaje >= 50 ? 'En Progreso' : 'Pendiente'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekProgress;
