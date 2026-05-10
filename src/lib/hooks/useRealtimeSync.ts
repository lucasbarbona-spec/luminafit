'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SyncEvent<T = unknown> {
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: T;
  timestamp: number;
  userId?: string;
}

interface RealtimeSyncOptions<T = unknown> {
  resource: string;
  initialData?: T[];
  onSync?: (events: SyncEvent<T>[]) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeSync<T extends { id: string | number }>({
  resource,
  initialData = [],
  onSync,
  onError
}: RealtimeSyncOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const eventQueueRef = useRef<SyncEvent<T>[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar datos
  const syncData = useCallback(async () => {
    if (!isConnected || isSyncing) return;

    setIsSyncing(true);
    try {
      // Simular sincronización con servidor
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Procesar eventos en cola
      if (eventQueueRef.current.length > 0) {
        const events = [...eventQueueRef.current];
        eventQueueRef.current = [];
        
        // Aplicar cambios locales
        const updatedData = events.reduce((acc, event) => {
          switch (event.type) {
            case 'create':
              return [...acc, event.data];
            case 'update':
              return acc.map(item => 
                item.id === event.data.id ? { ...item, ...event.data } : item
              );
            case 'delete':
              return acc.filter(item => item.id !== event.data.id);
            default:
              return acc;
          }
        }, data);
        
        setData(updatedData);
        setLastSync(new Date());
        
        if (onSync) {
          onSync(events);
        }
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, isSyncing, data, onSync, onError]);

  // Simular conexión WebSocket
  const connect = useCallback(() => {
    try {
      setIsConnected(true);
      
      // Iniciar sincronización periódica
      syncIntervalRef.current = setInterval(() => {
        syncData();
      }, 5000); // Cada 5 segundos
      
      return true;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return false;
    }
  }, [onError, syncData]);

  // Desconectar
  const disconnect = useCallback(() => {
    setIsConnected(false);
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  // Crear elemento
  const create = useCallback((item: Omit<T, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    } as T;

    // Agregar a cola de eventos
    eventQueueRef.current.push({
      type: 'create',
      resource,
      data: newItem,
      timestamp: Date.now()
    });

    // Actualizar estado local inmediatamente
    setData(prev => [...prev, newItem]);

    // Intentar sincronizar
    syncData();

    return newItem;
  }, [resource, syncData]);

  // Actualizar elemento
  const update = useCallback((id: string | number, updates: Partial<T>) => {
    const updatedItem = { id, ...updates } as T;

    // Agregar a cola de eventos
    eventQueueRef.current.push({
      type: 'update',
      resource,
      data: updatedItem,
      timestamp: Date.now()
    });

    // Actualizar estado local inmediatamente
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));

    // Intentar sincronizar
    syncData();

    return updatedItem;
  }, [resource, syncData]);

  // Eliminar elemento
  const remove = useCallback((id: string | number) => {
    // Agregar a cola de eventos
    eventQueueRef.current.push({
      type: 'delete',
      resource,
      data: { id } as T,
      timestamp: Date.now()
    });

    // Actualizar estado local inmediatamente
    setData(prev => prev.filter(item => item.id !== id));

    // Intentar sincronizar
    syncData();
  }, [resource, syncData]);

  // Forzar sincronización manual
  const forceSync = useCallback(() => {
    syncData();
  }, [syncData]);

  // Conectar al montar el componente
  useEffect(() => {
    const connected = connect();
    
    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, [connect, disconnect]);

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isConnected,
    isSyncing,
    lastSync,
    create,
    update,
    remove,
    forceSync,
    connect,
    disconnect
  };
}

// Hook para sincronización multi-usuario
export function useMultiUserSync<T extends { id: string | number }>(
  userId: string,
  options: RealtimeSyncOptions<T>
) {
  const sync = useRealtimeSync<T>(options);
  const [activeUsers, setActiveUsers] = useState<string[]>([userId]);
  const [conflicts, setConflicts] = useState<Array<{
    id: string | number;
    localData: T;
    remoteData: T;
    timestamp: number;
  }>>([]);

  // Simular detección de conflictos
  const detectConflicts = useCallback((localData: T[], remoteData: T[]) => {
    const newConflicts = localData
      .filter(localItem => {
        const remoteItem = remoteData.find(r => r.id === localItem.id);
        return remoteItem && JSON.stringify(localItem) !== JSON.stringify(remoteItem);
      })
      .map(localItem => ({
        id: localItem.id,
        localData: localItem,
        remoteData: remoteData.find(r => r.id === localItem.id)!,
        timestamp: Date.now()
      }));

    if (newConflicts.length > 0) {
      setConflicts(newConflicts);
    }
  }, []);

  // Resolver conflicto
  const resolveConflict = useCallback((id: string | number, resolution: 'local' | 'remote') => {
    setConflicts(prev => prev.filter(c => c.id !== id));
    
    if (resolution === 'local') {
      // Mantener datos locales y enviar al servidor
      const localItem = sync.data.find(item => item.id === id);
      if (localItem) {
        sync.update(id, localItem);
      }
    } else {
      // Aceptar datos remotos
      const conflict = conflicts.find(c => c.id === id);
      if (conflict) {
        sync.update(id, conflict.remoteData);
      }
    }
  }, [conflicts, sync]);

  return {
    ...sync,
    activeUsers,
    conflicts,
    detectConflicts,
    resolveConflict
  };
}

// Hook para sincronización offline
export function useOfflineSync<T extends { id: string | number }>(
  options: RealtimeSyncOptions<T>
) {
  const sync = useRealtimeSync<T>(options);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOperations, setPendingOperations] = useState<SyncEvent<T>[]>([]);
  const eventQueueRef = useRef<SyncEvent<T>[]>([]);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Procesar operaciones pendientes
      if (pendingOperations.length > 0) {
        pendingOperations.forEach(op => {
          sync.create(op.data as Omit<T, 'id'>);
        });
        setPendingOperations([]);
        sync.forceSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingOperations, sync]);

  // Sobrescribir métodos para manejar modo offline
  const create = useCallback((item: Omit<T, 'id'>) => {
    const event: SyncEvent<T> = {
      type: 'create',
      resource: options.resource,
      data: { ...item, id: Date.now().toString() } as T,
      timestamp: Date.now()
    };

    if (!isOnline) {
      setPendingOperations(prev => [...prev, event] as SyncEvent<T>[]);
    }

    return sync.create(item);
  }, [isOnline, options.resource, sync]);

  const update = useCallback((id: string | number, updates: Partial<T>) => {
    const event: SyncEvent<T> = {
      type: 'update',
      resource: options.resource,
      data: { id, ...updates } as T,
      timestamp: Date.now()
    };

    if (!isOnline) {
      setPendingOperations(prev => [...prev, event] as SyncEvent<T>[]);
    }

    return sync.update(id, updates);
  }, [isOnline, options.resource, sync]);

  const remove = useCallback((id: string | number) => {
    const event: SyncEvent<T> = {
      type: 'delete',
      resource: options.resource,
      data: { id } as T,
      timestamp: Date.now()
    };

    if (!isOnline) {
      setPendingOperations(prev => [...prev, event] as SyncEvent<T>[]);
    }

    return sync.remove(id);
  }, [isOnline, options.resource, sync]);

  return {
    ...sync,
    isOnline,
    pendingOperations,
    create,
    update,
    remove
  };
}
