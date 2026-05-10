'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProductos } from '@/lib/hooks/useFirestore';
import { calculatePriceWithFee } from '@/lib/utils/mercadopago';
import ClientNav from '@/components/navigation/ClientNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ShoppingBag, Tag, Search, Filter } from 'lucide-react';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';

export default function ClientMarketplace() {
  const { user } = useAuth();
  const { formatCurrency } = useArgentinaLocale();
  
  const trainerId = 'trainer123'; // idealmente user?.trainerId
  const { productos, loading } = useProductos(trainerId);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = productos.filter(p => 
    p.activo && 
    (p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBuy = async (productId: string, price: number, title: string) => {
    setProcessing(productId);
    try {
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `LuminaFit Store: ${title}`,
          description: title,
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
      window.location.href = checkoutUrl; 
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-1">Descubre rutinas, suplementos y más</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const { grossAmount } = calculatePriceWithFee(product.precio);
              
              return (
                <Card key={product.id} variant="elevated" className="relative flex flex-col hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.nombre}</h3>
                    </div>
                    <Badge variant="outline" className="w-fit mb-3">{product.categoria}</Badge>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{product.descripcion}</p>
                    
                    <div className="flex items-center justify-between mt-auto mb-4">
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(grossAmount)}</span>
                      {product.stock && product.stock < 10 && (
                         <span className="text-xs text-error-600 font-medium">Solo quedan {product.stock}</span>
                      )}
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="w-full" 
                      onClick={() => handleBuy(product.id, product.precio, product.nombre)}
                      disabled={processing === product.id}
                      icon={processing === product.id ? undefined : <ShoppingBag className="w-4 h-4" />}
                    >
                      {processing === product.id ? 'Procesando...' : 'Comprar Ahora'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">No hay productos disponibles en este momento.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
