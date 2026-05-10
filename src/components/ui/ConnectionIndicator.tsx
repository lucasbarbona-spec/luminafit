'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ConnectionIndicatorProps {
  isConnected: boolean;
  isSyncing?: boolean;
  lastSync?: Date | null;
  pendingCount?: number;
  onForceSync?: () => void;
  variant?: 'compact' | 'detailed';
}

export default function ConnectionIndicator({
  isConnected,
  isSyncing = false,
  lastSync = null,
  pendingCount = 0,
  onForceSync,
  variant = 'compact'
}: ConnectionIndicatorProps) {
  const getStatusColor = () => {
    if (!isConnected) return 'danger';
    if (isSyncing) return 'warning';
    if (pendingCount > 0) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Desconectado';
    if (isSyncing) return 'Sincronizando...';
    if (pendingCount > 0) return `${pendingCount} pendientes`;
    return 'Conectado';
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="w-4 h-4" />;
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (pendingCount > 0) return <AlertTriangle className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} size="sm">
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </Badge>
        {(isSyncing || pendingCount > 0) && onForceSync && (
          <button
            onClick={onForceSync}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Forzar sincronización"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor()} size="sm">
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </Badge>
          <span className="text-sm font-medium text-gray-700">Estado de Conexión</span>
        </div>
        {(isSyncing || pendingCount > 0) && onForceSync && (
          <button
            onClick={onForceSync}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Forzar sincronización"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {lastSync && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Última sincronización:</span>
            <span className="text-gray-900 font-medium">{formatLastSync(lastSync)}</span>
          </div>
        )}
        
        {pendingCount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Operaciones pendientes:</span>
            <span className="text-yellow-600 font-medium">{pendingCount.toString()}</span>
          </div>
        )}
        
        {!isConnected && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <WifiOff className="w-4 h-4" />
            <span>Trabajando en modo offline. Los cambios se sincronizarán cuando se restaure la conexión.</span>
          </div>
        )}
        
        {isSyncing && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sincronizando datos con el servidor...</span>
          </div>
        )}
      </div>
    </div>
  );
}
