'use client';

import Link from 'next/link';
import type { Alumno } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { User, Calendar, Target, ArrowRight } from 'lucide-react';

interface AlumnoCardProps {
  alumno: Alumno;
}

export default function AlumnoCard({ alumno }: AlumnoCardProps) {
  const estadoVariant = alumno.estado === 'activo' ? 'success' : 'default';
  const estadoText = alumno.estado === 'activo' ? 'Activo' : 'Inactivo';

  return (
    <Link href={`/alumnos/${alumno.id}`}>
      <Card variant="elevated" className="hover:shadow-strong transition-all duration-300 cursor-pointer group">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{alumno.nombre}</h3>
                <p className="text-sm text-gray-600">{alumno.email}</p>
              </div>
            </div>
            <Badge variant={estadoVariant} size="sm">
              {estadoText}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Inicio: {new Date(alumno.fechaInicio).toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <span className="font-medium">Objetivos:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {alumno.objetivos.slice(0, 2).map((objetivo, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {objetivo}
                    </Badge>
                  ))}
                  {alumno.objetivos.length > 2 && (
                    <Badge variant="outline" size="sm">
                      +{alumno.objetivos.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver perfil
              <ArrowRight className="w-4 h-4" />
            </span>
            <div className="flex gap-1">
              <Badge variant="info" size="sm">
                {alumno.objetivos.length} objetivos
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}