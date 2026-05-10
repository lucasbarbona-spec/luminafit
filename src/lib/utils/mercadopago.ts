/**
 * Utilidades para integración con Mercado Pago
 */

// Tasa de Mercado Pago para liberación en el momento: 5.99% + IVA (21%)
// 5.99 * 1.21 = 7.2479%
export const MERCADO_PAGO_DEFAULT_FEE_PERCENTAGE = 7.2479;

/**
 * Calcula el precio final que se le debe cobrar al cliente para que 
 * el vendedor reciba exactamente el monto neto deseado, trasladando
 * el costo de la comisión de Mercado Pago.
 * 
 * Fórmula: Precio Bruto = Monto Neto / (1 - Porcentaje de Comisión / 100)
 * 
 * @param netAmount Monto neto que desea recibir el vendedor
 * @param feePercentage Porcentaje total de la comisión (default: 7.2479)
 * @returns Un objeto con el precio bruto (final), la comisión calculada y el monto neto.
 */
export function calculatePriceWithFee(netAmount: number, feePercentage: number = MERCADO_PAGO_DEFAULT_FEE_PERCENTAGE) {
  if (netAmount <= 0) return { netAmount: 0, feeAmount: 0, grossAmount: 0 };
  
  // Convertimos el porcentaje a decimal (ej. 7.2479 -> 0.072479)
  const feeDecimal = feePercentage / 100;
  
  // Calculamos el monto bruto para que descontando el % quede el neto
  const grossAmount = netAmount / (1 - feeDecimal);
  
  // Calculamos el monto exacto de la comisión
  const feeAmount = grossAmount - netAmount;
  
  return {
    netAmount: Math.round(netAmount * 100) / 100,
    feeAmount: Math.round(feeAmount * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100
  };
}
