const fs = require('fs');
const path = require('path');

// Variables de entorno proporcionadas por el usuario
const envContent = `# Firebase Configuration (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDa9yL9qNZMqZbXuGK3fNhSYq9eLWnqunk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=luminafit-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=luminafit-production
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=31252551333
NEXT_PUBLIC_FIREBASE_APP_ID=1:31252551333:web:2de100c055e8202bbb5f4c

# Security (REQUIRED)
TOKEN_SECRET=2e9bejzO2czOwEDJWfSu0c/n8WPpz6vASZhTfiQK1fo=

# Application Configuration (REQUIRED)
NEXT_PUBLIC_BASE_URL=https://luminafit.vercel.app/

# Environment
NODE_ENV=development

# Cloudinary Configuration (OPTIONAL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqwgtebwo
NEXT_PUBLIC_CLOUDINARY_API_KEY=638781924153475
CLOUDINARY_API_SECRET=IPM6exfiJAJrGgytQA2D2ORi2Ig
`;

// Ruta del archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📁 Ubicación:', envPath);
  console.log('🔥 Firebase configurado con el proyecto: luminafit-production');
  console.log('☁️ Cloudinary configurado con el cloud: dqwgtebwo');
} catch (error) {
  console.error('❌ Error al crear el archivo .env.local:', error.message);
}
