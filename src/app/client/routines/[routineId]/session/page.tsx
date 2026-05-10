'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useClientRoutines } from '@/lib/hooks/useFirestore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ClientNav from '@/components/navigation/ClientNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  ChevronRight,
  ChevronLeft,
  X,
  Save,
  RotateCcw,
  Flame,
  Target,
  Heart,
  Zap
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;
  notes?: string;
  completed: boolean;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: number;
  difficulty: string;
  completed: boolean;
}



export default function RoutineSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const routineId = params.routineId as string;
  const { rutinas, loading: rutinasLoading } = useClientRoutines(user?.uid);
  
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [exerciseData, setExerciseData] = useState<Record<string, { weight?: number; reps?: number; notes?: string }>>({});

  // Redirect if not authenticated or not client
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && (user.role === 'trainer' || user.role === 'admin')) {
      router.push('/trainer/dashboard');
    }
  }, [user, authLoading, router]);

  // Load routine data
  useEffect(() => {
    if (rutinas && rutinas.length > 0) {
      const foundRoutine = rutinas.find(r => r.id === routineId);
      if (foundRoutine) {
        const flattenedExercises = foundRoutine.bloques?.flatMap(b => b.ejercicios).map(e => ({
          id: e.id || Math.random().toString(36).substring(2, 9),
          name: e.nombre,
          sets: e.series,
          reps: parseInt(e.repeticiones) || 10,
          weight: undefined,
          restTime: e.pausa || e.pause || 60,
          notes: e.notas,
          completed: false
        })) || [];

        setRoutine({
          id: foundRoutine.id,
          name: foundRoutine.nombre,
          description: foundRoutine.descripcion || 'Sin descripción',
          estimatedDuration: 45,
          difficulty: 'Intermedio',
          completed: false,
          exercises: flattenedExercises
        });
      }
    }
  }, [routineId, rutinas]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionStarted && !isSessionPaused) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionStarted, isSessionPaused]);

  const handleStartSession = () => {
    setIsSessionStarted(true);
    setSessionStartTime(new Date());
  };

  const handlePauseSession = () => {
    setIsSessionPaused(!isSessionPaused);
  };

  const handleCompleteExercise = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < (routine?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleSaveExerciseData = (exerciseId: string, data: { weight?: number; reps?: number; notes?: string }) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: data
    }));
  };

  const handleCompleteSession = async () => {
    try {
      if (user?.uid && routine) {
        const progressToSave = {
          rutinaId: routine.id,
          duracionMinutos: Math.round(sessionDuration / 60),
          fecha: new Date(),
          ejercicios: Array.from(completedExercises).map(exId => ({
            ejercicioId: exId,
            peso: exerciseData[exId]?.weight || 0,
            reps: exerciseData[exId]?.reps || 0,
            notas: exerciseData[exId]?.notes || '',
          }))
        };

        const progressRef = collection(db, 'users', user.uid, 'progreso');
        await addDoc(progressRef, progressToSave);
      }
      router.push('/client/progress');
    } catch (error) {
      console.error("Error saving progress", error);
      router.push('/client/progress');
    }
  };

  const handleCancelSession = () => {
    if (confirm('¿Estás seguro de que quieres cancelar la sesión? El progreso no se guardará.')) {
      router.push('/client/routines');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading || rutinasLoading || !routine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cargando rutina...</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentExercise = routine.exercises[currentExerciseIndex];
  const progress = (completedExercises.size / routine.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">{routine.name}</h1>
            <p className="text-gray-500 font-medium">{routine.description}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Badge variant="default" className="bg-warning-100 text-warning-700">
              <Clock className="w-3 h-3 mr-1" />
              {routine.estimatedDuration} min
            </Badge>
            <Badge variant="default" className="bg-primary-100 text-primary-700">
              <Target className="w-3 h-3 mr-1" />
              {routine.difficulty}
            </Badge>
          </div>
        </div>

        {/* Session Timer */}
        {isSessionStarted && (
          <Card className="mb-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Tiempo de sesión</p>
                    <p className="text-3xl font-black">{formatDuration(sessionDuration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-none">
                    <Flame className="w-3 h-3 mr-1" />
                    {completedExercises.size}/{routine.exercises.length} ejercicios
                  </Badge>
                  <Button
                    variant="outline"
                    size="md"
                    icon={isSessionPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    onClick={handlePauseSession}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {isSessionPaused ? 'Reanudar' : 'Pausar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isSessionStarted ? (
          /* Start Session View */
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Rutina</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Ejercicios</span>
                  </div>
                  <span className="font-bold text-gray-900">{routine.exercises.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Duración estimada</span>
                  </div>
                  <span className="font-bold text-gray-900">{routine.estimatedDuration} min</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Dificultad</span>
                  </div>
                  <span className="font-bold text-gray-900">{routine.difficulty}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Ejercicios</h3>
                <div className="space-y-2">
                  {routine.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{exercise.name}</p>
                        <p className="text-sm text-gray-500">{exercise.sets} series × {exercise.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={<Play className="w-5 h-5" />}
                onClick={handleStartSession}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Active Session View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Exercise */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5" />
                      Ejercicio {currentExerciseIndex + 1} de {routine.exercises.length}
                    </CardTitle>
                    <Badge variant="default" className="bg-primary-100 text-primary-700">
                      {Math.round(progress)}% completado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Exercise Info */}
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">{currentExercise.name}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="default" className="bg-info-100 text-info-700">
                          {currentExercise.sets} series
                        </Badge>
                        <Badge variant="default" className="bg-success-100 text-success-700">
                          {currentExercise.reps} reps
                        </Badge>
                        {currentExercise.weight && (
                          <Badge variant="default" className="bg-warning-100 text-warning-700">
                            {currentExercise.weight} kg
                          </Badge>
                        )}
                        <Badge variant="default" className="bg-gray-100 text-gray-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {currentExercise.restTime}s descanso
                        </Badge>
                      </div>
                      {currentExercise.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                          <strong>Nota:</strong> {currentExercise.notes}
                        </p>
                      )}
                    </div>

                    {/* Exercise Timer */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Tiempo de descanso</span>
                        <span className="text-2xl font-bold text-primary-600">{currentExercise.restTime}s</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-full" />
                      </div>
                    </div>

                    {/* Exercise Data Input */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Peso (kg)</label>
                          <Input
                            type="number"
                            placeholder={currentExercise.weight?.toString()}
                            value={exerciseData[currentExercise.id]?.weight || ''}
                            onChange={(e) => handleSaveExerciseData(currentExercise.id, {
                              ...exerciseData[currentExercise.id],
                              weight: parseFloat(e.target.value) || undefined
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Reps</label>
                          <Input
                            type="number"
                            placeholder={currentExercise.reps.toString()}
                            value={exerciseData[currentExercise.id]?.reps || ''}
                            onChange={(e) => handleSaveExerciseData(currentExercise.id, {
                              ...exerciseData[currentExercise.id],
                              reps: parseFloat(e.target.value) || undefined
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Notas</label>
                        <textarea
                          placeholder="Notas sobre este ejercicio..."
                          className="w-full h-20 rounded-xl border border-gray-200 p-3 resize-none"
                          value={exerciseData[currentExercise.id]?.notes || ''}
                          onChange={(e) => handleSaveExerciseData(currentExercise.id, {
                            ...exerciseData[currentExercise.id],
                            notes: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ChevronLeft className="w-4 h-4" />}
                        onClick={handlePreviousExercise}
                        disabled={currentExerciseIndex === 0}
                        className="flex-1"
                      >
                        Anterior
                      </Button>
                      <Button
                        variant={completedExercises.has(currentExercise.id) ? 'success' : 'primary'}
                        size="md"
                        icon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => handleCompleteExercise(currentExercise.id)}
                        className="flex-1"
                      >
                        {completedExercises.has(currentExercise.id) ? 'Completado' : 'Marcar como completado'}
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ChevronRight className="w-4 h-4" />}
                        onClick={handleNextExercise}
                        disabled={currentExerciseIndex === routine.exercises.length - 1}
                        className="flex-1"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exercise List */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Ejercicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {routine.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${
                          index === currentExerciseIndex
                            ? 'bg-primary-100 border-2 border-primary-500'
                            : completedExercises.has(exercise.id)
                            ? 'bg-success-50 border-2 border-success-300'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentExerciseIndex(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            completedExercises.has(exercise.id)
                              ? 'bg-success-500 text-white'
                              : index === currentExerciseIndex
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {completedExercises.has(exercise.id) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{exercise.name}</p>
                            <p className="text-xs text-gray-500">{exercise.sets}×{exercise.reps}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Session Actions */}
                  <div className="mt-6 space-y-2">
                    <Button
                      variant="success"
                      size="lg"
                      icon={<Save className="w-5 h-5" />}
                      onClick={handleCompleteSession}
                      className="w-full"
                      disabled={completedExercises.size === 0}
                    >
                      Completar Sesión
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      icon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => {
                        if (confirm('¿Reiniciar la sesión? Se perderá el progreso actual.')) {
                          setCompletedExercises(new Set());
                          setExerciseData({});
                          setCurrentExerciseIndex(0);
                          setSessionDuration(0);
                        }
                      }}
                      className="w-full"
                    >
                      Reiniciar
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      icon={<X className="w-4 h-4" />}
                      onClick={handleCancelSession}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
