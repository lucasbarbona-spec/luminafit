'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { signUpWithEmail } from '@/lib/auth';
import { useMercadoPago } from '@/lib/hooks/useMercadoPago';
import { ArgentinaConfig } from '@/lib/config/argentina';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Dumbbell,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Check
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { initiateSubscriptionCheckout } = useMercadoPago({ sandbox: true });
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'trainer' | 'client',
    selectedPlan: 'profesional' as string
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  const subscriptionPlans = ArgentinaConfig.subscriptionPlans;

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'trainer' || user.role === 'admin') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handlePlanSelect = (planId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlan: planId
    }));
  };

  const handleRoleChange = (role: 'trainer' | 'client') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    // Firebase registration
    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role
      );
      
      // If client, proceed to Mercado Pago checkout
      if (formData.role === 'client') {
        const selectedPlan = subscriptionPlans.find(p => p.id === formData.selectedPlan);
        if (selectedPlan) {
          const subscriptionData = {
            alumnoId: formData.email, // Use email as temporary ID
            planId: selectedPlan.id,
            planNombre: selectedPlan.name,
            precio: selectedPlan.price,
            moneda: selectedPlan.currency,
            frecuencia: (selectedPlan.billing === 'monthly' ? 'mensual' : 
                       selectedPlan.billing === 'quarterly' ? 'trimestral' : 'anual') as 'mensual' | 'trimestral' | 'anual',
            estado: 'pendiente' as const,
            fechaInicio: new Date(),
            fechaProximoPago: new Date(),
            metodoPago: 'mercado_pago' as const
          };
          
          await initiateSubscriptionCheckout(subscriptionData);
          return;
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        // Redirect based on role
        if (formData.role === 'trainer') {
          router.push('/trainer/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
        <Card variant="elevated" className="w-full max-w-md text-center">
          <CardHeader className="pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <p className="text-gray-600 mt-2">Tu cuenta ha sido creada correctamente. Redirigiendo...</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <p className="text-gray-600 mt-2">Únete a LuminaFit</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {/* Plan selection for clients */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Selecciona tu plan de suscripción</label>
                <div className="space-y-3">
                  {subscriptionPlans.map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.selectedPlan === plan.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                            {plan.popular && <Badge variant="success" className="text-xs">Popular</Badge>}
                          </div>
                          <p className="text-2xl font-bold text-gray-900">${plan.price.toLocaleString()} {plan.currency}</p>
                          <p className="text-sm text-gray-600">
                            {plan.billing === 'monthly' ? 'Mensual' : 
                             plan.billing === 'quarterly' ? 'Trimestral' : 'Anual'}
                          </p>
                        </div>
                        {formData.selectedPlan === plan.id && (
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      {plan.features && plan.features.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center">
                              <Check className="w-3 h-3 mr-2 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Badge variant="outline">Gratis</Badge>
            <Badge variant="outline">Seguro</Badge>
            <Badge variant="outline">Rápido</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
