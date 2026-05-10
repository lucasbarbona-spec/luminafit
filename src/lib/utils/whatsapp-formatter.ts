import type { Rutina, Bloque, Ejercicio } from '@/types';

export const generateWhatsAppMessage = (
  rutina: Rutina,
  alumno: { nombre: string },
  shareableLink: string
): string => {
  const bloques = rutina.bloques
    .map((bloque) => formatBloque(bloque))
    .join('\n\n');

  return `
🏋️ *RUTINA DE ${alumno.nombre.toUpperCase()}*

📅 Semanas: 1-${rutina.semanas}
⏱️ Completa los ejercicios y registra tus cargas reales

${bloques}

🔗 *Ver rutina completa aquí:*
${shareableLink}

💡 Tips:
• Realiza todos los ejercicios según el plan
• Registra tus cargas reales al terminar
• Al final de la semana, verás tu progreso

¡Éxito! 💪
  `.trim();
};

const formatBloque = (bloque: Bloque): string => {
  const ejercicios = bloque.ejercicios
    .map((ej, idx) => formatEjercicio(ej, idx + 1))
    .join('\n');

  return `*${bloque.nombre}*\n${ejercicios}`;
};

const formatEjercicio = (ejercicio: Ejercicio, numero: number): string => {
  return `
${numero}. ${ejercicio.nombre}
   📊 ${ejercicio.series}x${ejercicio.repeticiones}
   ⚖️ ${ejercicio.intensidad}
   ⏸️ ${ejercicio.pausa}seg pausa
  `.trim();
};

export const generateWhatsAppLink = (
  message: string,
  phoneNumber?: string
): string => {
  const encoded = encodeURIComponent(message);
  if (phoneNumber) {
    return `https://wa.me/${phoneNumber}?text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?text=${encoded}`;
};