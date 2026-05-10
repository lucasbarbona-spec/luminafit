import { NextRequest, NextResponse } from 'next/server';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
const MERCADO_PAGO_API_URL = process.env.MERCADO_PAGO_API_URL || 'https://api.mercadopago.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suscripcion } = body;

    if (!suscripcion || !suscripcion.planNombre || !suscripcion.precio) {
      return NextResponse.json(
        { message: 'Faltan parámetros requeridos de suscripción' },
        { status: 400 }
      );
    }

    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: 'No está configurado el access token de Mercado Pago' },
        { status: 500 }
      );
    }

    // Determinar frecuencia en meses
    const frecuenciaMeses = {
      mensual: 1,
      trimestral: 3,
      anual: 12,
    };

    const meses = frecuenciaMeses[suscripcion.frecuencia as keyof typeof frecuenciaMeses] || 1;

    // Crear preferencia para suscripción recurrente
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const preferenceData = {
      items: [
        {
          title: `Suscripción ${suscripcion.planNombre} - ${suscripcion.frecuencia}`,
          description: `Plan de entrenamiento personal: ${suscripcion.planNombre}`,
          quantity: 1,
          currency_id: suscripcion.moneda.toUpperCase(),
          unit_price: Number(suscripcion.precio),
        },
      ],
      back_urls: {
        success: `${appUrl}/payment/success`,
        failure: `${appUrl}/payment/failure`,
        pending: `${appUrl}/payment/pending`,
      },
      auto_return: 'approved',
      metadata: {
        type: 'subscription',
        alumnoId: suscripcion.alumnoId,
        planId: suscripcion.planId,
        frecuencia: suscripcion.frecuencia,
      },
      // Para suscripciones recurrentes, Mercado Pago tiene un endpoint específico
      // Aquí usamos preferencia simple por ahora, pero se puede migrar a preapproval
    };

    const response = await fetch(`${MERCADO_PAGO_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Mercado Pago (suscripción):', errorData);
      return NextResponse.json(
        { message: 'Error al crear suscripción en Mercado Pago', details: errorData },
        { status: response.status }
      );
    }

    const preference = await response.json();

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error en subscription:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
