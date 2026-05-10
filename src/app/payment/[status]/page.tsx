'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { CheckCircle, AlertTriangle, Info, ArrowLeft } from 'lucide-react';

const statusTexts: Record<string, { title: string; description: string; icon: ReactNode }> = {
  success: {
    title: 'Pago realizado con éxito',
    description: 'Tu pago fue procesado. Ahora podés enviar el comprobante para que tu entrenador lo revise y apruebe.',
    icon: <CheckCircle className="w-10 h-10 text-emerald-600" />,
  },
  pending: {
    title: 'Pago pendiente',
    description: 'Tu pago está en estado pendiente. Si ya tenés un comprobante, envíalo para que tu entrenador pueda aprobarlo.',
    icon: <AlertTriangle className="w-10 h-10 text-amber-600" />,
  },
  failure: {
    title: 'Pago no completado',
    description: 'Hubo un problema con tu pago. Intenta nuevamente o contacta a soporte si el error persiste.',
    icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
  },
};

export default function PaymentStatusPage({ params }: { params: { status: string } }) {
  const status = params.status;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [receiptUrl, setReceiptUrl] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const statusData = statusTexts[status] || {
    title: 'Estado de pago',
    description: 'Revisa los detalles de tu pago y envía el comprobante si corresponde.',
    icon: <Info className="w-10 h-10 text-slate-600" />,
  };

  const paymentId = searchParams.get('collection_id') || searchParams.get('payment_id') || '';
  const preferenceId = searchParams.get('preference_id') || '';
  const collectionStatus = searchParams.get('collection_status') || '';
  const paymentType = searchParams.get('payment_type') || '';
  const amount = searchParams.get('amount') || '';
  const currency = searchParams.get('currency') || '';

  const canSendReceipt = status !== 'failure';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage('Debes iniciar sesión para enviar el comprobante.');
      return;
    }

    if (!receiptUrl && comment.trim().length < 10) {
      setErrorMessage('Ingresa el enlace del comprobante o un comentario detallado.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'paymentReceipts'), {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        status: status === 'pending' ? 'pendiente' : 'comprobado',
        paymentId,
        preferenceId,
        collectionStatus,
        paymentType,
        amount: amount ? Number(amount) : null,
        currency,
        receiptUrl: receiptUrl.trim() || null,
        comment: comment.trim() || null,
        approved: false,
        createdAt: new Date(),
      });

      setSuccessMessage('Comprobante enviado. Tu entrenador podrá revisarlo y aprobarlo pronto.');
      setReceiptUrl('');
      setComment('');
    } catch (error) {
      console.error('Error al enviar comprobante:', error);
      setErrorMessage('No se pudo enviar el comprobante. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const details = useMemo(
    () => [
      { label: 'ID de pago', value: paymentId },
      { label: 'Preference ID', value: preferenceId },
      { label: 'Estado', value: collectionStatus || status },
      { label: 'Método', value: paymentType },
      { label: 'Monto', value: amount && currency ? `${currency} ${amount}` : '' },
    ].filter(item => item.value),
    [paymentId, preferenceId, collectionStatus, paymentType, amount, currency, status]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8">
          <CardHeader className="flex flex-col items-center gap-4 text-center pb-6">
            <div className="rounded-full bg-white p-4 shadow-sm">
              {statusData.icon}
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">{statusData.title}</CardTitle>
            <p className="text-slate-600">{statusData.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {details.length > 0 && (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Detalles del pago</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {details.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white p-3 border border-slate-200">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-900 break-all">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canSendReceipt ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Enlace del comprobante (opcional)</label>
                  <Input
                    value={receiptUrl}
                    onChange={(event) => setReceiptUrl(event.target.value)}
                    placeholder="https://..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Comentario o detalle</label>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={5}
                    className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none"
                    placeholder="Describe el comprobante, por ejemplo: Pago realizado en la app de Mercado Pago, fecha y monto."
                  />
                </div>
                {errorMessage && (
                  <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="primary" loading={saving}>
                    {saving ? 'Enviando comprobante...' : 'Enviar comprobante'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push('/') }>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
                No es posible enviar un comprobante en este estado. Si necesitas ayuda, contacta a soporte.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
