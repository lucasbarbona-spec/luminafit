'use client';

import React, { useState } from 'react';
import type { Ejercicio } from '@/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import VideoPlayer from './VideoPlayer';
import { 
  Play, 
  Pause, 
  Dumbbell, 
  Timer, 
  TrendingUp, 
  Plus, 
  CheckCircle,
  X
} from 'lucide-react';

interface ExerciseViewerProps {
  ejercicio: Ejercicio;
  rutinaId: string;
  semana: number;
  alumnoId: string;
}

interface SerieData {
  serie: number;
  reps: number;
  peso: number;
  completado: boolean;
}

export default function ExerciseViewer({
  ejercicio,
  rutinaId,
  semana,
  alumnoId,
}: ExerciseViewerProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [seriesCompletadas, setSeriesCompletadas] = useState<SerieData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSerie = () => {
    const newSerie: SerieData = {
      serie: seriesCompletadas.length + 1,
      reps: 0,
      peso: 0,
      completado: false,
    };
    setSeriesCompletadas([...seriesCompletadas, newSerie]);
  };

  const handleUpdateSerie = (index: number, field: keyof SerieData, value: number | boolean) => {
    const updatedSeries = [...seriesCompletadas];
    updatedSeries[index] = { ...updatedSeries[index], [field]: value };
    setSeriesCompletadas(updatedSeries);
  };

  const handleRemoveSerie = (index: number) => {
    const updatedSeries = seriesCompletadas.filter((_, i) => i !== index);
    setSeriesCompletadas(updatedSeries);
  };

  const completedSeries = seriesCompletadas.filter(s => s.completado).length;
  const totalSeries = ejercicio.series;
  const progress = totalSeries > 0 ? (completedSeries / totalSeries) * 100 : 0;

  return (
    <Card variant="elevated" className="mb-6 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-600" />
              </div>
              <CardTitle className="text-lg">{ejercicio.nombre}</CardTitle>
              {progress === 100 && (
                <CheckCircle className="w-5 h-5 text-success-600" />
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="primary" icon={<TrendingUp className="w-3 h-3" />}>
                {ejercicio.series}×{ejercicio.repeticiones}
              </Badge>
              <Badge variant="info" icon={<Timer className="w-3 h-3" />}>
                {ejercicio.pausa || ejercicio.pause}s descanso
              </Badge>
              <Badge variant="outline">{ejercicio.intensidad}</Badge>
            </div>
            {ejercicio.musculosPrincipales && (
              <div className="flex flex-wrap gap-1">
                {ejercicio.musculosPrincipales.map((musculo, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {musculo}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {ejercicio.videoUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVideo(!showVideo)}
                icon={showVideo ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              >
                {showVideo ? 'Cerrar' : 'Video'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Ocultar' : 'Registrar'}
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span key="label">Progreso</span>
            <span key="value">{completedSeries}/{totalSeries} series</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-success-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      {showVideo && ejercicio.videoUrl && (
        <CardContent className="pt-0">
          <VideoPlayer url={ejercicio.videoUrl} />
        </CardContent>
      )}
      {isExpanded && (
        <CardContent className="pt-0 border-t border-gray-100">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">Registro - Semana {semana}</h4>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddSerie}
                icon={<Plus className="w-4 h-4" />}
                disabled={seriesCompletadas.length >= totalSeries}
              >
                Agregar Serie
              </Button>
            </div>
            {seriesCompletadas.length > 0 ? (
              <div className="space-y-3">
                {seriesCompletadas.map((serie, idx) => (
                  <div key={idx} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                      {serie.serie.toString()}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={serie.reps || ''}
                        onChange={(e) => handleUpdateSerie(idx, 'reps', parseInt(e.target.value) || 0)}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Peso (kg)"
                        value={serie.peso || ''}
                        onChange={(e) => handleUpdateSerie(idx, 'peso', parseFloat(e.target.value) || 0)}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={serie.completado ? 'success' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateSerie(idx, 'completado', !serie.completado)}
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        {serie.completado ? 'Completado' : 'Completar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSerie(idx)}
                        icon={<X className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay series registradas. Agrega tu primera serie.
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}