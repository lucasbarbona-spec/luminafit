/**
 * Validación de variables de entorno
 * Asegura que todas las variables necesarias estén configuradas antes de iniciar la aplicación
 */

interface EnvConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    messagingSenderId: string;
    appId: string;
  };
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  security: {
    tokenSecret: string;
  };
  app: {
    baseUrl: string;
    nodeEnv: string;
  };
}

const requiredEnvVars = {
  firebase: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ],
  security: ['TOKEN_SECRET'],
  app: ['NEXT_PUBLIC_BASE_URL'],
} as const;

const optionalEnvVars = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

export function validateEnv(): EnvConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar variables requeridas de Firebase
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  requiredEnvVars.firebase.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Falta variable de entorno requerida: ${varName}`);
    }
  });

  // Validar variables de seguridad
  const tokenSecret = process.env.TOKEN_SECRET || '';
  if (!tokenSecret) {
    errors.push('Falta variable de entorno requerida: TOKEN_SECRET');
  } else if (tokenSecret.length < 32) {
    warnings.push('TOKEN_SECRET debería tener al menos 32 caracteres para mayor seguridad');
  }

  // Validar BASE_URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    warnings.push('NEXT_PUBLIC_BASE_URL no está configurado, usando valor por defecto: http://localhost:3000');
  }

  // Validar variables opcionales de Cloudinary
  const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  };

  const cloudinaryConfigured = Object.values(cloudinaryConfig).some(v => v !== '');
  if (cloudinaryConfigured) {
    const missingCloudinary = optionalEnvVars.filter(varName => !process.env[varName]);
    if (missingCloudinary.length > 0) {
      warnings.push(
        `Cloudinary está parcialmente configurado. Faltan: ${missingCloudinary.join(', ')}`
      );
    }
  }

  // Mostrar errores y advertencias en desarrollo
  if (typeof window !== 'undefined') {
    // Solo en el cliente
    if (errors.length > 0) {
      console.error('❌ Errores de configuración:', errors);
    }
    if (warnings.length > 0) {
      console.warn('⚠️ Advertencias de configuración:', warnings);
    }
  }

  // En producción, lanzar error si faltan variables requeridas
  if (process.env.NODE_ENV === 'production' && errors.length > 0) {
    throw new Error(
      `Configuración inválida: ${errors.join('; ')}. Por favor configura todas las variables de entorno requeridas.`
    );
  }

  return {
    firebase: firebaseConfig,
    cloudinary: cloudinaryConfigured ? cloudinaryConfig : undefined,
    security: {
      tokenSecret,
    },
    app: {
      baseUrl,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
  };
}

export const env = validateEnv();

// Función helper para verificar si Cloudinary está configurado
export function isCloudinaryConfigured(): boolean {
  return !!env.cloudinary?.cloudName;
}

// Función helper para verificar si estamos en desarrollo
export function isDevelopment(): boolean {
  return env.app.nodeEnv === 'development';
}

// Función helper para verificar si estamos en producción
export function isProduction(): boolean {
  return env.app.nodeEnv === 'production';
}
