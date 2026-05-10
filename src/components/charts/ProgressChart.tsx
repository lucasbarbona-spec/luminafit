'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressData {
  week: number;
  weight: number;
  reps: number;
  date: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
  metric: 'weight' | 'reps';
  alumnoId: string;
}

export const ProgressChart = ({
  data,
  title = 'Progreso',
  metric,
  alumnoId
}: ProgressChartProps) => {
  const getTrend = () => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-2);
    const change = recent[1][metric] - recent[0][metric];
    return change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up':
        return 'text-success-600 bg-success-50';
      case 'down':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAverage = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item[metric], 0);
    return (sum / data.length).toFixed(1);
  };

  const getMax = () => {
    if (data.length === 0) return 0;
    return Math.max(...data.map(item => item[metric]));
  };

  const getMin = () => {
    if (data.length === 0) return 0;
    return Math.min(...data.map(item => item[metric]));
  };

  const getChartData = () => {
    const maxValue = getMax();
    const minValue = getMin();
    const range = maxValue - minValue || 1;

    return data.map((item, index) => {
      const normalizedValue = ((item[metric] - minValue) / range) * 100;
      return {
        ...item,
        normalizedValue,
        x: (index / (data.length - 1 || 1)) * 100,
      };
    });
  };

  const chartData = getChartData();

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <Badge variant="outline" className={getTrendColor()}>
              {getTrend() === 'up' ? 'Mejorando' : getTrend() === 'down' ? 'Disminuyendo' : 'Estable'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">{getAverage()}</div>
                <div className="text-sm text-gray-600">Promedio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-600">{getMax()}</div>
                <div className="text-sm text-gray-600">Máximo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning-600">{getMin()}</div>
                <div className="text-sm text-gray-600">Mínimo</div>
              </div>
            </div>

            {/* Simple Chart */}
            <div className="relative h-32 bg-gray-50 rounded-lg p-4">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line x1={0} y1={25} x2={100} y2={25} stroke="#e5e7eb" strokeWidth={1} />
                <line x1={0} y1={50} x2={100} y2={50} stroke="#e5e7eb" strokeWidth={1} />
                <line x1={0} y1={75} x2={100} y2={75} stroke="#e5e7eb" strokeWidth={1} />
                
                {/* Data line */}
                <polyline
                  points={chartData.map(d => `${d.x},${100 - d.normalizedValue}`).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                
                {/* Data points */}
                {chartData.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={100 - point.normalizedValue}
                    r={3}
                    fill="#3b82f6"
                  />
                ))}
              </svg>
            </div>

            {/* Data table */}
            <div className="max-h-32 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Semana</th>
                    <th className="text-right py-2">{metric === 'weight' ? 'Peso (kg)' : 'Reps'}</th>
                    <th className="text-right py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-5).reverse().map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">Semana {item.week}</td>
                      <td className="text-right py-2 font-medium">{item[metric]}</td>
                      <td className="text-right py-2 text-gray-600">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay datos de progreso disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
