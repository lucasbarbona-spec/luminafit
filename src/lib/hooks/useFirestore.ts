'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  addDoc,
  onSnapshot,
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Alumno, Rutina, ProgresoEjercicio, Plan, Producto } from '@/types';

// Hook para clientes - obtener sus rutinas asignadas
export function useClientRoutines(clientId?: string) {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    // Optimización: Consultar directamente la colección de rutinas del cliente
    // Asumiendo que hay una colección 'users/{clientId}/rutinas' o similar
    // Si no existe, usar la consulta optimizada de trainers
    const fetchRoutines = async () => {
      try {
        // Intentar obtener rutinas desde la colección del usuario primero
        const userRoutinesRef = collection(db, 'users', clientId, 'rutinas');
        const userRoutinesSnapshot = await getDocs(userRoutinesRef);
        
        if (!userRoutinesSnapshot.empty && isMounted) {
          const rutinasData = userRoutinesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })) as Rutina[];
          setRutinas(rutinasData);
          setLoading(false);
          return;
        }

        // Fallback: buscar en trainers (consulta optimizada con límite)
        const trainersQuery = query(
          collection(db, 'trainers'),
          where('alumnos', 'array-contains', clientId),
          limit(10) // Limitar a 10 trainers para evitar consultas excesivas
        );

        const trainersSnapshot = await getDocs(trainersQuery);
        const rutinasData: Rutina[] = [];

        // Procesar en paralelo con Promise.all para mejor rendimiento
        const routinePromises = trainersSnapshot.docs.map(async (trainerDoc) => {
          const trainerId = trainerDoc.id;
          const rutinasRef = query(
            collection(db, 'trainers', trainerId, 'rutinas'),
            where('alumnosAsignados', 'array-contains', clientId),
            limit(20) // Limitar rutinas por trainer
          );
          
          const rutinasSnapshot = await getDocs(rutinasRef);
          return rutinasSnapshot.docs.map(rutinaDoc => ({
            id: rutinaDoc.id,
            ...rutinaDoc.data(),
            createdAt: rutinaDoc.data().createdAt?.toDate() || new Date(),
            updatedAt: rutinaDoc.data().updatedAt?.toDate() || new Date(),
          })) as Rutina[];
        });

        const allRoutines = await Promise.all(routinePromises);
        const flattenedRoutines = allRoutines.flat();

        if (isMounted) {
          setRutinas(flattenedRoutines);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar rutinas');
          setLoading(false);
        }
      }
    };

    fetchRoutines();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return { rutinas, loading, error };
}

interface ProgressItem {
  id: string;
  fecha: Date;
  [key: string]: unknown;
}

// Hook para clientes - obtener su progreso
export function useClientProgress(clientId?: string) {
  const [progreso, setProgreso] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;

    // Optimización: Consultar directamente la colección de progreso del cliente
    const fetchProgress = async () => {
      try {
        // Intentar obtener progreso desde la colección del usuario primero
        const userProgressRef = collection(db, 'users', clientId, 'progreso');
        const userProgressSnapshot = await getDocs(userProgressRef);
        
        if (!userProgressSnapshot.empty && isMounted) {
          const progresoData = userProgressSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha?.toDate() || new Date(),
          }));
          setProgreso(progresoData);
          setLoading(false);
          return;
        }

        // Fallback: buscar en trainers (consulta optimizada con límite)
        const trainersQuery = query(
          collection(db, 'trainers'),
          where('alumnos', 'array-contains', clientId),
          limit(10)
        );

        const trainersSnapshot = await getDocs(trainersQuery);
        const progresoData: ProgressItem[] = [];

        // Procesar en paralelo con Promise.all para mejor rendimiento
        const progressPromises = trainersSnapshot.docs.map(async (trainerDoc) => {
          const trainerId = trainerDoc.id;
          const alumnoDocRef = doc(db, 'trainers', trainerId, 'alumnos', clientId);
          
          try {
            const alumnoDoc = await getDoc(alumnoDocRef);
            if (alumnoDoc.exists()) {
              const progresoRef = query(
                collection(alumnoDoc.ref, 'progreso'),
                orderBy('fecha', 'desc'),
                limit(50) // Limitar a 50 registros de progreso
              );
              const progresoSnapshot = await getDocs(progresoRef);
              return progresoSnapshot.docs.map(progresoDoc => ({
                id: progresoDoc.id,
                ...progresoDoc.data(),
                fecha: progresoDoc.data().fecha?.toDate() || new Date(),
              }));
            }
            return [];
          } catch {
            return [];
          }
        });

        const allProgress = await Promise.all(progressPromises);
        const flattenedProgress = allProgress.flat();

        if (isMounted) {
          setProgreso(flattenedProgress);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar progreso');
          setLoading(false);
        }
      }
    };

    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return { progreso, loading, error };
}

interface AchievementItem {
  id: string;
  unlockedAt: Date;
  [key: string]: unknown;
}

// Hook para clientes - obtener sus logros
export function useClientAchievements(clientId?: string) {
  const [logros, setLogros] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const logrosRef = collection(db, 'users', clientId, 'logros');
    const q = query(logrosRef, orderBy('unlockedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logrosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          unlockedAt: doc.data().unlockedAt?.toDate() || new Date(),
        }));
        setLogros(logrosData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clientId]);

  return { logros, loading, error };
}

export function useAlumnos(trainerId?: string) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', trainerId, 'alumnos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alumnosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          fechaInicio: doc.data().fechaInicio?.toDate() || new Date(),
          fechaNacimiento: doc.data().fechaNacimiento?.toDate() || undefined,
        })) as Alumno[];
        setAlumnos(alumnosData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainerId]);

  const createAlumno = async (alumno: Omit<Alumno, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    const docRef = await addDoc(collection(db, 'trainers', trainerId, 'alumnos'), {
      ...alumno,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  };

  const updateAlumno = async (id: string, data: Partial<Alumno>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    const docRef = doc(db, 'trainers', trainerId, 'alumnos', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteAlumno = async (id: string) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    await deleteDoc(doc(db, 'trainers', trainerId, 'alumnos', id));
  };

  return { alumnos, loading, error, createAlumno, updateAlumno, deleteAlumno };
}

export function useRutinas(trainerId?: string) {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', trainerId, 'rutinas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rutinasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Rutina[];
        setRutinas(rutinasData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainerId]);

  const createRutina = async (rutina: Omit<Rutina, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    const docRef = await addDoc(collection(db, 'trainers', trainerId, 'rutinas'), {
      ...rutina,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  };

  const updateRutina = async (id: string, data: Partial<Rutina>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    const docRef = doc(db, 'trainers', trainerId, 'rutinas', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteRutina = async (id: string) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    
    await deleteDoc(doc(db, 'trainers', trainerId, 'rutinas', id));
  };

  return { rutinas, loading, error, createRutina, updateRutina, deleteRutina };
}

export function useProgreso(trainerId?: string, alumnoId?: string) {
  const [progreso, setProgreso] = useState<ProgresoEjercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId || !alumnoId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', trainerId, 'alumnos', alumnoId, 'progreso'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const progresoData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as ProgresoEjercicio[];
        setProgreso(progresoData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainerId, alumnoId]);

  const createProgreso = async (data: Omit<ProgresoEjercicio, 'id' | 'createdAt'>) => {
    if (!trainerId || !alumnoId) throw new Error('Trainer ID and Alumno ID are required');
    
    const docRef = await addDoc(
      collection(db, 'trainers', trainerId, 'alumnos', alumnoId, 'progreso'),
      {
        ...data,
        createdAt: new Date(),
      }
    );
    return docRef.id;
  };

  const updateProgreso = async (id: string, data: Partial<ProgresoEjercicio>) => {
    if (!trainerId || !alumnoId) throw new Error('Trainer ID and Alumno ID are required');
    
    const docRef = doc(db, 'trainers', trainerId, 'alumnos', alumnoId, 'progreso', id);
    await updateDoc(docRef, data);
  };

  return { progreso, loading, error, createProgreso, updateProgreso };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export function useMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (senderId: string, text: string) => {
    if (!chatId) throw new Error('No chat ID');
    const msg = {
      senderId,
      text,
      timestamp: new Date(),
      isRead: false
    };
    await addDoc(collection(db, 'chats', chatId, 'messages'), msg);
    await setDoc(doc(db, 'chats', chatId), {
      lastMessage: text,
      lastMessageTime: new Date(),
      participants: chatId.split('_')
    }, { merge: true });
  };

  return { messages, loading, sendMessage };
}

export interface AppNotification {
  id: string;
  type: 'routine' | 'message' | 'achievement' | 'session';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', userId, 'notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as AppNotification[];
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (id: string) => {
    if (!userId) return;
    await updateDoc(doc(db, 'users', userId, 'notifications', id), {
      isRead: true
    });
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    const batch = writeBatch(db);
    notifications.filter(n => !n.isRead).forEach(n => {
      batch.update(doc(db, 'users', userId, 'notifications', n.id), { isRead: true });
    });
    await batch.commit();
  };

  const deleteNotification = async (id: string) => {
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId, 'notifications', id));
  };

  const deleteNotifications = async (ids: string[]) => {
    if (!userId) return;
    const batch = writeBatch(db);
    ids.forEach(id => {
      batch.delete(doc(db, 'users', userId, 'notifications', id));
    });
    await batch.commit();
  };

  return { notifications, loading, markAsRead, markAllAsRead, deleteNotification, deleteNotifications };
}

export function usePlanes(trainerId?: string) {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', trainerId, 'planes'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const planesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Plan[];
        setPlanes(planesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainerId]);

  const createPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    const docRef = await addDoc(collection(db, 'trainers', trainerId, 'planes'), {
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  };

  const updatePlan = async (id: string, data: Partial<Plan>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    const docRef = doc(db, 'trainers', trainerId, 'planes', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deletePlan = async (id: string) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    await deleteDoc(doc(db, 'trainers', trainerId, 'planes', id));
  };

  return { planes, loading, error, createPlan, updatePlan, deletePlan };
}

export function useProductos(trainerId?: string) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trainers', trainerId, 'productos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const prodData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Producto[];
        setProductos(prodData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [trainerId]);

  const createProducto = async (producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    const docRef = await addDoc(collection(db, 'trainers', trainerId, 'productos'), {
      ...producto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  };

  const updateProducto = async (id: string, data: Partial<Producto>) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    const docRef = doc(db, 'trainers', trainerId, 'productos', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteProducto = async (id: string) => {
    if (!trainerId) throw new Error('Trainer ID is required');
    await deleteDoc(doc(db, 'trainers', trainerId, 'productos', id));
  };

  return { productos, loading, error, createProducto, updateProducto, deleteProducto };
}
