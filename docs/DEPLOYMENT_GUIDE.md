# 🚀 Guía de Despliegue - LuminaFit

Esta guía te llevará paso a paso desde la configuración de Firebase hasta el despliegue en Render.

## 📋 Requisitos Previos

- Cuenta de [Firebase](https://console.firebase.google.com/)
- Cuenta de [Render](https://render.com/)
- Node.js 18+ instalado localmente
- Git configurado

---

## 🔥 Parte 1: Configuración de Firebase Console

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o "Add project"
3. Nombre del proyecto: `luminafit-[tu-nombre]` (ej: `luminafit-production`)
4. Habilita Google Analytics (opcional pero recomendado)
5. Selecciona cuenta de Google Analytics
6. Haz clic en "Crear proyecto"

### Paso 2: Configurar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en "Comenzar"
3. Ve a la pestaña **Sign-in method**
4. Habilita los siguientes proveedores:
   - **Email/Password**: Haz clic en "Habilitar" → "Guardar"
   - **Google**: Haz clic en "Habilitar" → Configura:
     - Nombre del proyecto público: `LuminaFit`
     - Email de soporte: tu-email@ejemplo.com
     - "Guardar"

### Paso 3: Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona modo de inicio: **Comenzar en modo de producción**
4. Elige ubicación: `nam5 (us-central)` o la más cercana a tus usuarios
5. Haz clic en "Listo"

### Paso 4: Configurar Storage (Opcional - para imágenes)

1. En el menú lateral, ve a **Storage**
2. Haz clic en "Comenzar"
3. Selecciona modo de inicio: **Comenzar en modo de producción**
4. Elige ubicación: misma que Firestore
5. Haz clic en "Listo"

### Paso 5: Obtener las Credenciales del Proyecto

1. Ve a **Configuración del proyecto** (icono de engranaje)
2. Desplázate hacia abajo a "Tus apps"
3. Haz clic en el ícono de `</>` (Web app)
4. Nombre de la app: `LuminaFit Web`
5. **IMPORTANTE**: Marca la casilla "También configurar Firebase Hosting" (aunque usaremos Render)
6. Haz clic en "Registrar app"
7. Copia las credenciales que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Paso 6: Configurar Reglas de Seguridad

1. Ve a **Firestore Database** → **Reglas**
2. Reemplaza las reglas por defecto con el contenido del archivo `firestore.rules` de tu proyecto
3. Haz clic en "Publicar"

Si configuraste Storage:
1. Ve a **Storage** → **Reglas**
2. Configura reglas básicas para desarrollo (ajusta para producción):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🌐 Parte 2: Preparación del Proyecto para Producción

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```

2. Edita `.env.local` con tus credenciales de Firebase:

```env
# Firebase Configuration (REQUIRED)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAINOZPintUP2PJIgbMvhz9xqD-rdeN-Bk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Cloudinary Configuration (OPTIONAL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_secret

# Security (REQUIRED)
TOKEN_SECRET=tu_secreto_seguro_muy_largo_min_32_caracteres

# Application Configuration (REQUIRED)
NEXT_PUBLIC_BASE_URL=https://tu-app.onrender.com

# Environment
NODE_ENV=production
```

### Paso 2: Generar TOKEN_SECRET Seguro

Ejecuta este comando para generar un token seguro:
```bash
openssl rand -base64 32
```
O usa un generador online de strings aleatorios de 32+ caracteres.

### Paso 3: Probar Localmente en Producción

```bash
# Instalar dependencias
npm install

# Probar build de producción
npm run build

# Probar servidor de producción localmente
npm start
```

Si todo funciona correctamente, continúa con Render.

---

## 🚀 Parte 3: Despliegue en Render

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en Git
2. Crea un commit con todos los cambios:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Paso 2: Crear Servicio Web en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Haz clic en "New" → "Web Service"
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repositorio de LuminaFit

### Paso 3: Configurar el Servicio

**Basic Settings:**
- **Name**: `luminafit` (o tu preferencia)
- **Environment**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Node Version**: `18.17.0` o superior
- **Environment Variables**: Agrega todas las variables de `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
TOKEN_SECRET=tu_secreto_seguro_muy_largo
NEXT_PUBLIC_BASE_URL=https://luminafit.onrender.com
NODE_ENV=production
```

Si usas Cloudinary, agrega también:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_secret
```

### Paso 4: Configurar Dominio Personalizado (Opcional)

1. En Render, ve a tu servicio → "Settings" → "Custom Domain"
2. Agrega tu dominio personalizado
3. Actualiza `NEXT_PUBLIC_BASE_URL` con tu dominio real
4. Configura los DNS según las instrucciones de Render

### Paso 5: Desplegar

1. Haz clic en "Create Web Service"
2. Render comenzará a construir automáticamente
3. El proceso tomará 5-15 minutos
4. Una vez completado, verás la URL de tu app: `https://luminafit.onrender.com`

---

## 🔧 Parte 4: Verificación y Troubleshooting

### Verificar Despliegue

1. **Accede a tu app**: Ve a la URL proporcionada por Render
2. **Prueba autenticación**: Intenta registrarte con email/password
3. **Verifica Firestore**: Los datos deberían guardarse correctamente
4. **Revisa logs**: En Render Dashboard → "Logs" para ver errores

### Problemas Comunes

#### Error: "NEXT_PUBLIC_BASE_URL not set"
- Asegúrate de que la variable esté configurada en Render
- Incluye `https://` en la URL

#### Error de Firebase: "Invalid API key"
- Verifica que las credenciales de Firebase sean correctas
- Asegúrate de que el dominio de Render esté autorizado en Firebase Console

#### Error de Build: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `NODE_ENV=production` esté configurado

#### Problemas de CORS
- En Firebase Console → Authentication → Settings → Authorized domains
- Agrega tu dominio de Render: `https://tu-app.onrender.com`

### Monitoreo

1. **Logs en Render**: Dashboard → Tu servicio → "Logs"
2. **Firebase Console**: Para ver uso de Auth y Firestore
3. **Google Analytics**: Si lo configuraste inicialmente

---

## 🎉 ¡Listo para Producción!

Tu aplicación LuminaFit ahora está desplegada y lista para usar. Los usuarios pueden:

- Registrarse como entrenadores o alumnos
- Crear y compartir rutinas
- Gestionar progreso y estadísticas
- Comunicarse a través del sistema de mensajes

### Próximos Pasos Recomendados

1. **Configurar dominio personalizado** para una URL más profesional
2. **Configurar Mercado Pago** para pagos si usas esa funcionalidad
3. **Configurar Cloudinary** para subida de imágenes
4. **Monitorear uso** a través de Firebase Console
5. **Configurar backups** automáticos de Firestore

¿Necesitas ayuda con algún paso específico o tienes algún error durante el proceso?