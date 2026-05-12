const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generar token seguro
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// Variables de entorno necesarias
const envConfig = `# Firebase Configuration (REQUIRED)
# Reemplaza estos valores con los de tu proyecto Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_firebase_app_id

# Security (REQUIRED)
TOKEN_SECRET=${generateSecureToken()}

# Application Configuration (REQUIRED)
NEXT_PUBLIC_BASE_URL=http://localhost:3005

# Environment
NODE_ENV=development

# Cloudinary Configuration (OPTIONAL)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
# NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_cloudinary_api_key
# CLOUDINARY_API_SECRET=tu_cloudinary_api_secret

# Mercado Pago Configuration (OPTIONAL)
# MERCADO_PAGO_ACCESS_TOKEN=tu_mercadopago_access_token
# MERCADO_PAGO_API_URL=https://api.mercadopago.com
# NEXT_PUBLIC_APP_URL=http://localhost:3005
`;

console.log('='.repeat(80));
console.log('CONFIGURACIÓN DE VARIABLES DE ENTORNO - LUMINAFIT');
console.log('='.repeat(80));
console.log('');
console.log('Crea un archivo .env.local en la raíz del proyecto con el siguiente contenido:');
console.log('');
console.log(envConfig);
console.log('');
console.log('⚠️  IMPORTANTE:');
console.log('');
console.log('1. Debes configurar las variables de Firebase con los datos de tu proyecto');
console.log('2. Copia y pega el contenido anterior en tu archivo .env.local');
console.log('3. Reemplaza los valores de Firebase con tus credenciales reales');
console.log('');
console.log('Para obtener las credenciales de Firebase:');
console.log('1. Ve a https://console.firebase.google.com');
console.log('2. Selecciona tu proyecto');
console.log('3. Ve a Configuración del proyecto > General');
console.log('4. Copia los datos de la sección "Configuración de Firebase SDK"');
console.log('');
console.log('TOKEN_SECRET generado automáticamente:', generateSecureToken());
console.log('');
