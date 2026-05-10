'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAlumnos, useRutinas } from '@/lib/hooks/useFirestore';
import TrainerNav from '@/components/navigation/TrainerNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  Search, 
  Users, 
  Dumbbell, 
  Activity, 
  Filter,
  X,
  ChevronRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'student' | 'routine' | 'exercise';
  title: string;
  subtitle: string;
  description?: string;
  metadata?: {
    progress?: number;
    sessions?: number;
    lastActive?: string;
    difficulty?: string;
    duration?: string;
  };
}

export default function TrainerSearchPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { alumnos, loading: alumnosLoading } = useAlumnos(user?.uid);
  const { rutinas, loading: rutinasLoading } = useRutinas(user?.uid);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'students' | 'routines' | 'exercises'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);

  React.useEffect(() => {
    if (alumnos && rutinas) {
      const studentResults: SearchResult[] = alumnos.map(a => ({
        id: a.id,
        type: 'student',
        title: a.nombre,
        subtitle: a.email,
        description: a.objetivos?.join(', ') || 'Alumno activo',
        metadata: {
          progress: 0,
          sessions: 0,
          lastActive: a.updatedAt ? a.updatedAt.toISOString().split('T')[0] : 'Hoy',
        }
      }));

      const routineResults: SearchResult[] = rutinas.map(r => ({
        id: r.id,
        type: 'routine',
        title: r.nombre,
        subtitle: `Nivel: Intermedio`,
        description: r.descripcion,
        metadata: {
          difficulty: 'Intermedio',
          duration: `45 min`
        }
      }));
      
      const exerciseResults: SearchResult[] = rutinas.flatMap(r => r.bloques || []).flatMap(b => b.ejercicios || []).map(e => ({
        id: e.id || Math.random().toString(36).substring(2, 9),
        type: 'exercise',
        title: e.nombre,
        subtitle: e.musculosPrincipales?.join(', ') || 'Ejercicio',
        description: e.notas,
        metadata: {
          difficulty: e.intensidad || 'Intermedio'
        }
      }));

      setAllResults([...studentResults, ...routineResults, ...exerciseResults]);
    }
  }, [alumnos, rutinas]);

  // Redirect if not authenticated or not trainer
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filtered = allResults.filter(result => {
      const matchesType = searchType === 'all' || result.type === searchType.slice(0, -1);
      const matchesQuery = 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        (result.description && result.description.toLowerCase().includes(query.toLowerCase()));
      return matchesType && matchesQuery;
    });

    setResults(filtered);
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'student':
        router.push('/trainer/students');
        break;
      case 'routine':
        router.push('/trainer/routines');
        break;
      case 'exercise':
        router.push('/trainer/routines');
        break;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <Users className="w-5 h-5" />;
      case 'routine':
        return <Dumbbell className="w-5 h-5" />;
      case 'exercise':
        return <Activity className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-primary-100 text-primary-700';
      case 'routine':
        return 'bg-success-100 text-success-700';
      case 'exercise':
        return 'bg-warning-100 text-warning-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Búsqueda Global</h1>
          <p className="text-gray-500 font-medium">Busca alumnos, rutinas y ejercicios</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar alumnos, rutinas, ejercicios..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    onClick={() => {
                      setSearchQuery('');
                      setResults([]);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={searchType === 'all' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setSearchType('all')}
                >
                  Todo
                </Button>
                <Button
                  variant={searchType === 'students' ? 'primary' : 'outline'}
                  size="md"
                  icon={<Users className="w-4 h-4" />}
                  onClick={() => setSearchType('students')}
                >
                  Alumnos
                </Button>
                <Button
                  variant={searchType === 'routines' ? 'primary' : 'outline'}
                  size="md"
                  icon={<Dumbbell className="w-4 h-4" />}
                  onClick={() => setSearchType('routines')}
                >
                  Rutinas
                </Button>
                <Button
                  variant={searchType === 'exercises' ? 'primary' : 'outline'}
                  size="md"
                  icon={<Activity className="w-4 h-4" />}
                  onClick={() => setSearchType('exercises')}
                >
                  Ejercicios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {results.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result) => (
                  <Card
                    key={result.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{result.title}</h3>
                          <p className="text-sm text-gray-500">{result.subtitle}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                      )}

                      {result.metadata && (
                        <div className="flex flex-wrap gap-2">
                          {result.metadata.progress !== undefined && (
                            <Badge variant="default" className="bg-primary-50 text-primary-700">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {result.metadata.progress}% progreso
                            </Badge>
                          )}
                          {result.metadata.sessions && (
                            <Badge variant="default" className="bg-success-50 text-success-700">
                              <Clock className="w-3 h-3 mr-1" />
                              {result.metadata.sessions} sesiones
                            </Badge>
                          )}
                          {result.metadata.lastActive && (
                            <Badge variant="default" className="bg-gray-50 text-gray-700">
                              Activo: {result.metadata.lastActive}
                            </Badge>
                          )}
                          {result.metadata.difficulty && (
                            <Badge variant="default" className="bg-warning-50 text-warning-700">
                              <Star className="w-3 h-3 mr-1" />
                              {result.metadata.difficulty}
                            </Badge>
                          )}
                          {result.metadata.duration && (
                            <Badge variant="default" className="bg-info-50 text-info-700">
                              {result.metadata.duration}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Access */}
        {!searchQuery && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Acceso Rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/trainer/students')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Alumnos</h3>
                      <p className="text-sm text-gray-500">Gestionar alumnos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/trainer/routines')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-success-100 text-success-600">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Rutinas</h3>
                      <p className="text-sm text-gray-500">Crear rutinas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/trainer/analytics')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-warning-100 text-warning-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Analíticas</h3>
                      <p className="text-sm text-gray-500">Ver estadísticas</p>
                    </div>
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
