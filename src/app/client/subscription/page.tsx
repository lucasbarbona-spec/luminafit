'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePlanes } from '@/lib/hooks/useFirestore';
import { calculatePriceWithFee } from '@/lib/utils/mercadopago';
import ClientNav from '@/components/navigation/ClientNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';

export default function ClientSubscription() {
  const { user } = useAuth();
  const { formatCurrency } = useArgentinaLocale();
  
  // Asumimos un trainerId hardcodeado o sacado de las preferencias del usuario para esta demo
  const trainerId = 'trainer123'; // idealmente user?.trainerId
  const { planes, loading } = usePlanes(trainerId);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, price: number, title: string) => {
    setProcessing(planId);
    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Suscripción: ${title}`,
          description: `Suscripción a LuminaFit - ${title}`,
          price: price,
          currency: 'ARS',
          passFeeToClient: true,
          metadata: {
            userId: user?.uid || null,
            email: user?.email || null,
          },
        }),
      });

      if (!response.ok) throw new Error('Error al generar el pago');
      
      const { init_point, sandbox_init_point } = await response.json();
      const isSandbox = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      const checkoutUrl = isSandbox && sandbox_init_point ? sandbox_init_point : init_point;
      window.location.href = checkoutUrl; // Redirigir a MP
    } catch (error) {
      console.error(error);
      alert("Hubo un error al iniciar el pago.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Suscripción</h1>
          <p className="text-gray-600 mt-1">Elige el plan que mejor se adapte a tus objetivos</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planes.filter(p => p.activo).map(plan => {
              const { grossAmount, feeAmount } = calculatePriceWithFee(plan.precio);
              
              return (
                <Card key={plan.id} variant="elevated" className="relative overflow-hidden flex flex-col">
                  {plan.nombre.toLowerCase().includes('elite') && (
                    <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMENDADO
                    </div>
                  )}
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-1">{plan.descripcion}</p>
                    
                    <div className="mb-6">
                      <p className="text-4xl font-black text-gray-900">
                        {formatCurrency(grossAmount)}
                        <span className="text-base font-normal text-gray-500 capitalize">/{plan.frecuencia}</span>
                      </p>
                      <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p>Valor neto del servicio: {formatCurrency(plan.precio)}</p>
                          <p>Recargo por servicio de pago: {formatCurrency(feeAmount)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="w-full mt-auto" 
                      onClick={() => handleSubscribe(plan.id, plan.precio, plan.nombre)}
                      disabled={processing === plan.id}
                      icon={processing === plan.id ? undefined : <CreditCard className="w-5 h-5" />}
                    >
                      {processing === plan.id ? 'Procesando...' : 'Suscribirse Ahora'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {!loading && planes.filter(p => p.activo).length === 0 && (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes disponibles</h3>
            <p className="text-gray-600">Tu entrenador aún no ha publicado planes de suscripción.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
