'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ShoppingCart, Tag, Star, Search, Zap, Heart } from 'lucide-react';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  categoria: string;
  stock: number;
  activo: boolean;
}

const products: Producto[] = [
  {
    id: '1',
    nombre: 'Rutina de Fuerza Avanzada',
    descripcion: 'Programa de 8 semanas para ganar fuerza y masa muscular.',
    precio: 15000,
    moneda: 'ARS',
    categoria: 'Rutina',
    stock: 999,
    activo: true
  },
  {
    id: '2',
    nombre: 'Plan Nutricional Personalizado',
    descripcion: 'Plan de alimentación adaptado a tus objetivos y estilo de vida.',
    precio: 8000,
    moneda: 'ARS',
    categoria: 'Plan',
    stock: 999,
    activo: true
  },
  {
    id: '3',
    nombre: 'Creatina Monohidrato',
    descripcion: 'Suplemento premium para aumentar energía y recuperación.',
    precio: 12000,
    moneda: 'ARS',
    categoria: 'Suplemento',
    stock: 25,
    activo: true
  }
];

export default function MarketplacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'trainer') {
      router.push('/trainer/marketplace');
    } else if (user?.role === 'client') {
      router.push('/client/marketplace');
    }
  }, [user, router]);

  const handleBuy = async (product: Producto) => {
    setProcessing(product.id);
    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `LuminaFit Store: ${product.nombre}`,
          description: product.descripcion,
          price: product.precio,
          currency: product.moneda,
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
      window.location.href = checkoutUrl; 
    } catch (error) {
      console.error(error);
      alert("Hubo un error al iniciar el pago.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-[2rem] bg-white/95 border border-gray-200 shadow-xl p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-800 px-4 py-2 text-sm font-semibold mb-3">
                <Tag className="w-4 h-4" /> Marketplace para Alumnos
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Descubre productos y programas para entrenar mejor</h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">Explora ofertas, planes y suplementos disponibles. Solo vista y compra para visitantes y alumnos.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-600 text-white shadow-lg">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Compra segura</span>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-amber-500" />
                  Experiencia orientada al cliente
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{product.nombre}</h2>
                    <p className="mt-2 text-sm text-slate-500">{product.categoria}</p>
                  </div>
                  <Badge variant="secondary" className="uppercase text-xs">{product.moneda}</Badge>
                </div>
                <p className="text-slate-600 mb-6">{product.descripcion}</p>
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">${product.precio.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Stock {product.stock > 0 ? product.stock : 'Agotado'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{product.stock > 0 ? 'Disponible' : 'Sin stock'}</div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleBuy(product)}
                    disabled={!product.activo || product.stock <= 0 || processing === product.id}
                  >
                    {processing === product.id ? 'Procesando...' : (product.stock > 0 ? 'Comprar ahora' : 'No disponible')}
                  </Button>
                  <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
