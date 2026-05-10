# Configuración de variables de entorno para Vercel

Para desplegar en Vercel, configura estas variables en el panel del servicio:

## Variables obligatorias de Firebase

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Variable de seguridad

- `TOKEN_SECRET`

## Variables de aplicación

- `NEXT_PUBLIC_BASE_URL` = `https://<tu-proyecto>.vercel.app` o tu dominio personalizado
- `NODE_ENV` = `production`

## Variables opcionales de Cloudinary

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Variables opcionales para Mercado Pago

- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_API_URL` = `https://api.mercadopago.com` (opcional)
- `NEXT_PUBLIC_APP_URL` = `https://<tu-proyecto>.vercel.app` o tu dominio personalizado

## Nota importante

Los valores reales de estas variables se deben copiar desde tu archivo local `.env.local`.

No debes subir `.env.local` al repositorio, y el archivo de ejemplo `.env.local.example` ya está sanitizado con valores de placeholder.

## Pasos en Vercel

1. Ve a [Vercel](https://vercel.com/) y crea una cuenta si no la tienes.
2. Conecta tu repositorio de GitHub a Vercel.
3. Selecciona el proyecto `luminafit`.
4. En la sección de **Environment Variables**, agrega cada variable con su valor real.
5. Guarda y despliega el proyecto.
6. Revisa el build y comprueba que la URL generada funciona correctamente.
