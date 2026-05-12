'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProductos } from '@/lib/hooks/useFirestore';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';
import TrainerNav from '@/components/navigation/TrainerNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Tag,
  Package,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import type { Producto, Oferta } from '@/types';

export default function TrainerMarketplace() {
  const { user } = useAuth();
  const { formatCurrency } = useArgentinaLocale();
  const router = useRouter();
  const { productos, createProducto, updateProducto, deleteProducto, loading: prodLoading } = useProductos(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    nombre: '', descripcion: '', precio: 0, stock: 100, 
    categoria: 'rutina' as 'rutina' | 'plan' | 'suplemento' | 'equipamiento' | 'otro'
  });

  const [offers, setOffers] = useState<Oferta[]>([
    {
      id: '1',
      productoId: '1',
      descuento: 20,
      precioOferta: 12000,
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2024-12-31'),
      activa: true,
      createdAt: new Date('2024-01-01')
    }
  ]);

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'rutina', label: 'Rutinas' },
    { value: 'plan', label: 'Planes' },
    { value: 'suplemento', label: 'Suplementos' },
    { value: 'equipamiento', label: 'Equipamiento' },
    { value: 'otro', label: 'Otros' }
  ];

  const filteredProducts = productos.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeOffers = offers.filter(offer => offer.activa);

  const totalRevenue = productos.reduce((sum, p) => sum + (p.precio * (p.stock || 0)), 0);
  const activeProducts = productos.filter(p => p.activo).length;

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (editingProduct) {
        await updateProducto(editingProduct.id, {
          nombre: newProduct.nombre,
          descripcion: newProduct.descripcion,
          precio: newProduct.precio,
          stock: newProduct.stock,
          categoria: newProduct.categoria
        });
      } else {
        await createProducto({
          ...newProduct,
          moneda: 'ARS',
          activo: true
        });
      }
      setShowCreateModal(false);
      setEditingProduct(null);
      setNewProduct({ nombre: '', descripcion: '', precio: 0, stock: 100, categoria: 'rutina' });
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerNav />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-1">Gestiona tus productos, precios y ofertas</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Nuevo Producto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Productos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                </div>
                <Package className="w-8 h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ofertas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeOffers.length}</p>
                </div>
                <Tag className="w-8 h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valor Inventario</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ventas del Mes</p>
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => 
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              )}
            </select>
            <Button
              variant="outline"
              icon={<Filter className="w-4 h-4" />}
            >
              Filtros
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const offer = activeOffers.find(o => o.productoId === product.id);
            const displayPrice = offer ? offer.precioOferta : product.precio;
            
            return (
              <Card
                key={product.id}
                variant="elevated"
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.nombre}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.descripcion}</p>
                    </div>
                    {!product.activo && (
                      <Badge variant="secondary" className="ml-2">Inactivo</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {offer ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatCurrency(product.precio)}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(product.precio)}</span>
                      )}
                      {offer && <Badge variant="success" className="mt-1">-{offer.descuento}%</Badge>}
                    </div>
                    <Badge variant="outline">{product.categoria}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Stock: {product.stock || 'Ilimitado'}</span>
                    {product.stock && product.stock < 10 && (
                      <span className="text-error-600 font-medium">Bajo stock</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => {
                        setEditingProduct(product);
                        setNewProduct({
                          nombre: product.nombre,
                          descripcion: product.descripcion,
                          precio: product.precio,
                          stock: product.stock || 100,
                          categoria: product.categoria
                        });
                        setShowCreateModal(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => deleteProducto(product.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card
            variant="elevated"
            className="text-center py-12"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-4">Comienza agregando tu primer producto al marketplace</p>
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowCreateModal(true)}
            >
              Agregar Producto
            </Button>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal (simplified placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
              <Button
                variant="ghost"
                icon={<X className="w-5 h-5" />}
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProduct(null);
                }}
              />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                  <Input 
                    required 
                    value={newProduct.nombre} 
                    onChange={e => setNewProduct({...newProduct, nombre: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Neto (ARS)</label>
                    <Input 
                      type="number" 
                      required 
                      value={newProduct.precio || ''} 
                      onChange={e => setNewProduct({...newProduct, precio: Number(e.target.value)})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <Input 
                      type="number" 
                      required 
                      value={newProduct.stock || ''} 
                      onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select 
                    className="w-full h-12 rounded-xl border border-gray-200 px-4"
                    value={newProduct.categoria}
                    onChange={e => setNewProduct({...newProduct, categoria: e.target.value as any})}
                  >
                    <option value="rutina">Rutina</option>
                    <option value="plan">Plan Nutricional</option>
                    <option value="suplemento">Suplemento</option>
                    <option value="equipamiento">Equipamiento</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    required
                    className="w-full rounded-xl border border-gray-200 p-3"
                    rows={3}
                    value={newProduct.descripcion}
                    onChange={e => setNewProduct({...newProduct, descripcion: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">Guardar Producto</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
