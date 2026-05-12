/**
 * Validación simplificada de variables de entorno
 */

export function validateEnv() {
  // Firebase configuration hardcoded for simplicity
  const firebaseConfig = {
    apiKey: "AIzaSyDa9yL9qNZMqZbXuGK3fNhSYq9eLWnqunk",
    authDomain: "luminafit-production.firebaseapp.com",
    projectId: "luminafit-production",
    messagingSenderId: "31252551333",
    appId: "1:31252551333:web:2de100c055e8202bbb5f4c"
  };

  const tokenSecret = "2e9bejzO2czOwEDJWfSu0c/n8WPpz6vASZhTfiQK1fo=";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://luminafit.onrender.com";

  return {
    firebase: firebaseConfig,
    security: {
      tokenSecret,
    },
    app: {
      baseUrl,
      nodeEnv: process.env.NODE_ENV || 'production',
    },
  };
}

export const env = validateEnv();

export function isDevelopment(): boolean {
  return env.app.nodeEnv === 'development';
}

export function isProduction(): boolean {
  return env.app.nodeEnv === 'production';
}
