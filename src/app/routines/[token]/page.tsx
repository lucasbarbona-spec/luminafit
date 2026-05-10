'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Rutina, Alumno } from '@/types';
import ExerciseViewer from '@/components/exercises/ExerciseViewer';
import WeekProgress from '@/components/exercises/WeekProgress';

export default function RoutineViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const alumnoId = searchParams.get('alumno');

  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [semanaActual, setSemanaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        if (!alumnoId || !token) {
          throw new Error('Datos insuficientes');
        }

        // Buscar rutina por token (simplificado)
        // En producción, validar token en Cloud Function
        const rutinaRef = collection(
          db,
          'trainers',
          'default-trainer-id', // Obtener del token
          'alumnos',
          alumnoId,
          'rutinas'
        );

        const q = query(rutinaRef, where('estado', '==', 'activa'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          throw new Error('Rutina no encontrada');
        }

        const docSnapshot = snapshot.docs[0];
        const rutinaData = docSnapshot.data() as Rutina;
        setRutina({
          ...rutinaData,
          id: docSnapshot.id,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando rutina');
      } finally {
        setLoading(false);
      }
    };

    fetchRutina();
  }, [alumnoId, token]);

  if (loading) return <div className="p-8">Cargando rutina...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!rutina) return <div className="p-8">Rutina no encontrada</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header PWA-friendly */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">{rutina.nombre}</h1>
          <p className="text-slate-600 text-sm">
            Alumno: {alumno?.nombre || 'Cargando...'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Selector de Semanas */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: rutina.semanas }, (_, i) => i + 1).map(
              (semana) => (
                <button
                  key={semana}
                  onClick={() => setSemanaActual(semana)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    semanaActual === semana
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Semana {semana}
                </button>
              )
            )}
          </div>
        </div>

        {/* Bloques de Ejercicios */}
        {rutina.bloques.map((bloque) => (
          <div key={bloque.id} className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{bloque.nombre}</h2>
            <div className="space-y-4">
              {bloque.ejercicios.map((ejercicio) => (
                <ExerciseViewer
                  key={ejercicio.id}
                  ejercicio={ejercicio}
                  rutinaId={rutina.id}
                  semana={semanaActual}
                  alumnoId={alumnoId!}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Progreso de la Semana */}
        <WeekProgress
          rutinaId={rutina.id}
          semana={semanaActual}
          alumnoId={alumnoId!}
        />
      </div>
    </div>
  );
}