import { NextRequest, NextResponse } from 'next/server';
import { calculatePriceWithFee } from '@/lib/utils/mercadopago';

// Configuración de Mercado Pago (debería estar en variables de entorno)
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
const MERCADO_PAGO_API_URL = process.env.MERCADO_PAGO_API_URL || 'https://api.mercadopago.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      currency,
      quantity,
      metadata,
      passFeeToClient = false,
    } = body;

    if (!title || !price || !currency) {
      return NextResponse.json(
        { message: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Validar que tengamos el access token
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: 'No está configurado el access token de Mercado Pago' },
        { status: 500 }
      );
    }

    // Calcular precio final si se pide trasladar la comisión
    let finalPrice = Number(price);
    let finalTitle = title;
    let finalDescription = description || title;

    if (passFeeToClient) {
      const { grossAmount, feeAmount } = calculatePriceWithFee(finalPrice);
      finalPrice = grossAmount;
      finalDescription = `${finalDescription} (Incluye recargo por servicio de pago de $${feeAmount.toFixed(2)})`;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Crear preferencia de pago
    const preferenceData = {
      items: [
        {
          title: finalTitle,
          description: finalDescription,
          quantity: quantity || 1,
          currency_id: currency.toUpperCase(),
          unit_price: finalPrice,
        },
      ],
      back_urls: {
        success: `${appUrl}/payment/success`,
        failure: `${appUrl}/payment/failure`,
        pending: `${appUrl}/payment/pending`,
      },
      auto_return: 'approved',
      metadata: metadata || {},
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
      console.error('Error de Mercado Pago:', errorData);
      return NextResponse.json(
        { message: 'Error al crear preferencia en Mercado Pago', details: errorData },
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
    console.error('Error en create-preference:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
