# Guía de Despliegue en Producción

Esta guía te ayudará a desplegar tu aplicación de Personal Trainer en un entorno de producción listo para uso comercial.

## 📋 Requisitos Previos

- Cuenta de Firebase (Firestore, Authentication)
- Cuenta de Cloudinary (opcional, para uploads de imágenes)
- Cuenta de hosting (Vercel, Netlify, o servidor propio)
- Node.js 18+ instalado localmente

## 🔧 Configuración de Variables de Entorno

### 1. Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Authentication** (Email/Password y Google)
4. Habilita **Firestore Database**
5. Configura las reglas de Firestore (ver sección de seguridad)
6. Copia las credenciales desde Project Settings > General

### 2. Cloudinary (Opcional)

1. Ve a [Cloudinary Console](https://cloudinary.com/console)
2. Crea una cuenta gratuita
3. Copia: Cloud Name, API Key, y API Secret

### 3. Generar TOKEN_SECRET

```bash
openssl rand -base64 32
```

### 4. Configurar Variables en tu Plataforma de Hosting

Para **Vercel**:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add TOKEN_SECRET
vercel env add NEXT_PUBLIC_BASE_URL production
# Si usas Mercado Pago:
vercel env add MERCADO_PAGO_ACCESS_TOKEN
vercel env add MERCADO_PAGO_API_URL production
vercel env add NEXT_PUBLIC_APP_URL production
```

Para **Netlify**:
Agrega las variables en Site Settings > Environment Variables

## 🔒 Reglas de Seguridad de Firestore

Copia estas reglas en tu Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para trainers
    match /trainers/{trainerId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == trainerId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Subcolección de alumnos
      match /alumnos/{alumnoId} {
        allow read: if request.auth != null && 
          (request.auth.uid == trainerId || 
           request.auth.uid == alumnoId);
        allow write: if request.auth != null && request.auth.uid == trainerId;
      }
      
      // Subcolección de rutinas
      match /rutinas/{rutinaId} {
        allow read: if request.auth != null && 
          (request.auth.uid == trainerId || 
           resource.data.alumnosAsignados.contains(request.auth.uid));
        allow write: if request.auth != null && request.auth.uid == trainerId;
      }
    }
  }
}
```

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod
```

### Opción 3: Build Manual

```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start
```

## ✅ Checklist Pre-Producción

- [ ] Todas las variables de entorno configuradas
- [ ] Reglas de Firestore aplicadas
- [ ] Authentication habilitado (Email + Google)
- [ ] TOKEN_SECRET generado y configurado
- [ ] NEXT_PUBLIC_BASE_URL apunta al dominio de producción
- [ ] Cloudinary configurado (si se usará uploads)
- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS habilitado
- [ ] Monitoreo configurado (opcional: Sentry, LogRocket)

## 📊 Monitoreo y Logs

### Firebase Console
- Monitorea Authentication en tiempo real
- Revisa Firestore usage
- Configura Crashlytics para errores

### Logs de Aplicación
La aplicación tiene Error Boundary configurado. Considera integrar un servicio de monitoreo como Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🔍 Validación Post-Despliegue

1. **Registro de Usuarios**
   - [ ] Prueba registro con email/password
   - [ ] Prueba login con Google
   - [ ] Verifica redirección correcta por rol

2. **Funcionalidad de Trainer**
   - [ ] Crear nuevo alumno
   - [ ] Asignar rutina
   - [ ] Ver dashboard con datos reales
   - [ ] Exportar reportes

3. **Funcionalidad de Cliente**
   - [ ] Ver rutinas asignadas
   - [ ] Registrar progreso
   - [ ] Ver logros

4. **Performance**
   - [ ] Tiempo de carga < 3s
   - [ ] Consultas Firestore optimizadas
   - [ ] Sin errores en consola

## 🐛 Solución de Problemas Comunes

### Error: "Configuración inválida"
- Verifica que todas las variables de entorno estén configuradas
- Revisa que TOKEN_SECRET tenga al menos 32 caracteres

### Error: "Permission denied" en Firestore
- Verifica las reglas de seguridad
- Asegúrate de que el usuario tenga el rol correcto

### Imágenes no cargan
- Verifica configuración de Cloudinary
- Revisa que las variables estén en el entorno correcto

## 📞 Soporte

Para problemas técnicos:
- Revisa los logs en Firebase Console
- Verifica la consola del navegador
- Contacta al equipo de desarrollo

## 🔄 Actualizaciones

Para actualizar la aplicación en producción:

```bash
# Vercel
git push origin main  # Despliegue automático

# Netlify
git push origin main  # Despliegue automático

# Manual
npm run build
# Subir archivos de /out o /public
```

## 📄 Licencia

Esta aplicación está lista para uso comercial. Asegúrate de cumplir con los términos de servicio de Firebase y Cloudinary.
