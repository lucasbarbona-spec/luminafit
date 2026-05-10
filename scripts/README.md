# Scripts de Prueba

## Crear Usuarios de Prueba

Este script crea usuarios de prueba en Firebase Authentication y Firestore.

### Pasos previos:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a Project Settings > Service accounts
4. Haz clic en "Generate new private key"
5. Descarga el archivo JSON
6. Renómbralo a `firebase-service-account.json`
7. Colócalo en la carpeta `scripts/` de este proyecto

### Instalar dependencias:

```bash
npm install firebase-admin --save-dev
```

### Ejecutar el script:

```bash
npx ts-node scripts/create-test-users.ts
```

### Usuarios creados:

**Entrenador:**
- Email: `trainer@test.com`
- Password: `test123456`

**Cliente:**
- Email: `client@test.com`
- Password: `test123456`

### Nota importante:

⚠️ **Nunca commits el archivo `firebase-service-account.json`** - está en `.gitignore` por seguridad. Este archivo contiene credenciales sensibles de tu proyecto Firebase.
