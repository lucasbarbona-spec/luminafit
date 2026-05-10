'use client';

import { useState } from 'react';
import type { MercadoPagoPreference, Suscripcion } from '@/types';

interface UseMercadoPagoOptions {
  sandbox?: boolean;
}

export function useMercadoPago(options: UseMercadoPagoOptions = {}) {
  const { sandbox = true } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crea una preferencia de pago en Mercado Pago
   */
  const createPreference = async (data: {
    title: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    metadata?: Record<string, unknown>;
  }): Promise<MercadoPagoPreference | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sandbox,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear preferencia de pago');
      }

      const preference: MercadoPagoPreference = await response.json();
      return preference;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una preferencia de pago para suscripción
   */
  const createSubscriptionPreference = async (suscripcion: Omit<Suscripcion, 'id' | 'createdAt' | 'updatedAt'>): Promise<MercadoPagoPreference | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mercadopago/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suscripcion,
          sandbox,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear suscripción');
      }

      const preference: MercadoPagoPreference = await response.json();
      return preference;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirige al checkout de Mercado Pago
   */
  const redirectToCheckout = (preference: MercadoPagoPreference) => {
    const checkoutUrl = sandbox ? preference.sandbox_init_point : preference.init_point;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  /**
   * Proceso completo: crear preferencia y redirigir al checkout
   */
  const initiateCheckout = async (data: {
    title: string;
    description: string;
    price: number;
    currency: string;
    quantity?: number;
    metadata?: Record<string, unknown>;
  }) => {
    const preference = await createPreference({
      ...data,
      quantity: data.quantity || 1,
    });

    if (preference) {
      redirectToCheckout(preference);
    }
  };

  /**
   * Proceso completo para suscripción
   */
  const initiateSubscriptionCheckout = async (suscripcion: Omit<Suscripcion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const preference = await createSubscriptionPreference(suscripcion);

    if (preference) {
      redirectToCheckout(preference);
    }
  };

  return {
    loading,
    error,
    createPreference,
    createSubscriptionPreference,
    redirectToCheckout,
    initiateCheckout,
    initiateSubscriptionCheckout,
  };
}
