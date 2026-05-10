'use client';

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { signInWithEmail } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/utils/validation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Dumbbell,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar en tiempo real y limpiar errores
    if (error) setError('');
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    // Validación de campos
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    const newFieldErrors: { email?: string; password?: string } = {};
    
    if (!emailValidation.isValid) {
      newFieldErrors.email = emailValidation.error;
    }
    
    if (!passwordValidation.isValid) {
      newFieldErrors.password = passwordValidation.error;
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }

    // Firebase authentication
    try {
      const loggedInUser = await signInWithEmail(formData.email, formData.password);
      
      // Redirect based on role
      if (loggedInUser.role === 'trainer' || loggedInUser.role === 'admin') {
        router.push('/trainer/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <p className="text-gray-600 mt-2">Accede a tu sistema de entrenamiento</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`pl-10 ${fieldErrors.email ? 'border-error-500' : ''}`}
                  disabled={isLoading}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-error-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>
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
                  className={`pl-10 pr-10 ${fieldErrors.password ? 'border-error-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-error-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Regístrate
              </button>
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Badge variant="outline">Seguro</Badge>
            <Badge variant="outline">Rápido</Badge>
            <Badge variant="outline">Profesional</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
