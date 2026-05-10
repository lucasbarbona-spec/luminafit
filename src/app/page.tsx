'use client';

import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Smartphone,
  ShoppingBag,
  Zap,
  Award
} from 'lucide-react';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';

export default function HomePage() {
  const { formatCurrency, config } = useArgentinaLocale();
  
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  const handleMarketplaceClick = () => {
    window.location.href = '/marketplace';
  };

  // Planes de suscripción en pesos argentinos
  const plans = config.subscriptionPlans;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Zap className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            LuminaFit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plataforma profesional de entrenamiento que conecta entrenadores con alumnos en Argentina
          </p>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Marketplace Card - Destacado */}
          <Card variant="elevated" className="md:col-span-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <Badge variant="primary" className="bg-white/20 text-white border-0">Nuevo</Badge>
              </div>
              <h2 className="text-2xl font-bold mb-3">Explora el Marketplace</h2>
              <p className="text-primary-100 mb-6 text-lg">
                Descubre rutinas pre-diseñadas, planes de entrenamiento y recursos exclusivos creados por entrenadores profesionales.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-primary-100">Rutinas</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-primary-100">Entrenadores</div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleMarketplaceClick}
                className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ir al Marketplace
              </Button>
            </CardContent>
          </Card>

          {/* Auth Card */}
          <Card variant="elevated" className="flex flex-col">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-xl">¿Ya tienes cuenta?</CardTitle>
              <p className="text-sm text-gray-500">Accede a tu panel de entrenamiento</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleLoginClick}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleRegisterClick}
                className="w-full"
              >
                Registrarse
              </Button>
              
              {/* Planes destacados */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center mb-3">PLANES POPULARES</p>
                <div className="space-y-2">
                  {plans.slice(0, 2).map((plan) => (
                    <div
                      key={plan.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                        plan.popular 
                          ? 'bg-primary-50 border border-primary-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-xs text-gray-500">{plan.billing === 'monthly' ? 'Mensual' : 'Anual'}</div>
                      </div>
                      <div className="font-bold text-primary-600">{formatCurrency(plan.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Rutinas Personalizadas</h3>
            <p className="text-sm text-gray-500">Planes adaptados a cada objetivo</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Seguimiento Real</h3>
            <p className="text-sm text-gray-500">Monitorea tu progreso diario</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Sistema de Logros</h3>
            <p className="text-sm text-gray-500">Motivación gamificada</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">App Móvil</h3>
            <p className="text-sm text-gray-500">Entrena desde cualquier lugar</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl font-black text-primary-600">1.200+</div>
            <div className="text-sm text-gray-600">Alumnos Activos</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black text-success-600">98%</div>
            <div className="text-sm text-gray-600">Satisfacción</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black text-warning-600">50+</div>
            <div className="text-sm text-gray-600">Entrenadores</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black text-purple-600">500+</div>
            <div className="text-sm text-gray-600">Rutinas</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <Badge variant="outline">💱 ARS</Badge>
            <Badge variant="outline">🇦🇷 Argentina</Badge>
            <Badge variant="outline">Seguro</Badge>
            <Badge variant="outline">Profesional</Badge>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 LuminaFit. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
