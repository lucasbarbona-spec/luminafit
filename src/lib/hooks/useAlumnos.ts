'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import type { Alumno } from '@/types';

export const useAlumnos = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', user.uid, 'alumnos'),
      where('estado', '!=', 'deleted')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            fechaInicio: doc.data().fechaInicio?.toDate(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          })) as Alumno[];

          setAlumnos(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error cargando alumnos');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err instanceof Error ? err.message : 'Error de conexión cargando alumnos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { alumnos, loading, error };
};