import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import type { Pago, Suscripcion } from '@/types';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mercado Pago envía notificaciones como application/x-www-form-urlencoded
    // Pero también puede enviar JSON en algunos casos
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Obtener detalles del pago desde Mercado Pago
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error('Error al obtener detalles del pago:', paymentId);
        return NextResponse.json({ message: 'Error al procesar pago' }, { status: 500 });
      }

      const paymentData = await paymentResponse.json();

      // Procesar el pago según su estado
      const paymentStatus = paymentData.status;
      const metadata = paymentData.metadata || {};

      if (paymentStatus === 'approved') {
        // Pago aprobado - guardar en Firestore
        const pago: Omit<Pago, 'id' | 'createdAt'> = {
          suscripcionId: metadata.suscripcionId || '',
          alumnoId: metadata.alumnoId || paymentData.payer?.email || '',
          monto: paymentData.transaction_amount,
          moneda: paymentData.currency_id,
          fecha: new Date(paymentData.date_approved),
          metodoPago: 'mercado_pago',
          estado: 'completado',
          mercadoPagoPaymentId: paymentId,
          mercadoPagoStatus: paymentStatus,
          notas: paymentData.description,
        };

        // Guardar pago en Firestore
        const pagosRef = collection(db, 'pagos');
        await addDoc(pagosRef, {
          ...pago,
          createdAt: new Date(),
        });

        // Si es una suscripción, actualizar el estado
        if (metadata.type === 'subscription' && metadata.alumnoId) {
          const suscripcionRef = doc(db, 'trainers', metadata.trainerId || 'default', 'alumnos', metadata.alumnoId, 'suscripcion');
          
          await updateDoc(suscripcionRef, {
            estado: 'activa',
            mercadoPagoPreferenceId: paymentData.preference_id,
            updatedAt: new Date(),
          });
        }
      } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        // Pago rechazado o cancelado
        const pago: Omit<Pago, 'id' | 'createdAt'> = {
          suscripcionId: metadata.suscripcionId || '',
          alumnoId: metadata.alumnoId || paymentData.payer?.email || '',
          monto: paymentData.transaction_amount,
          moneda: paymentData.currency_id,
          fecha: new Date(),
          metodoPago: 'mercado_pago',
          estado: 'fallido',
          mercadoPagoPaymentId: paymentId,
          mercadoPagoStatus: paymentStatus,
        };

        const pagosRef = collection(db, 'pagos');
        await addDoc(pagosRef, {
          ...pago,
          createdAt: new Date(),
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
