# LuminaFit - Plataforma de Entrenamiento Personal

Una aplicación profesional de gestión de entrenamiento personal diseñada para entrenadores y alumnos en Argentina.

## 🚀 Características Principales

### Para Entrenadores
- **Gestión de Alumnos**: Seguimiento completo de progreso y rutinas
- **Rutinas Personalizadas**: Creación y edición de planes de entrenamiento
- **Análisis y Estadísticas**: Dashboard con métricas detalladas
- **Comunicación Directa**: Sistema de mensajes integrado
- **Calendario de Sesiones**: Gestión de horarios y citas
- **Marketplace**: Venta de rutinas y planes pre-diseñados

### Para Alumnos
- **Seguimiento de Progreso**: Registro detallado de entrenamientos
- **Rutinas Guiadas**: Ejecución de planes con instrucciones
- **Logros y Motivación**: Sistema de gamificación
- **Comunicación con Entrenador**: Chat directo
- **Calendario Personal**: Gestión de sesiones

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, Lucide React Icons
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Almacenamiento**: Firebase Storage, Cloudinary
- **Pagos**: Mercado Pago
- **Despliegue**: Vercel (recomendado)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Mercado Pago (opcional)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd luminafit
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```

Configura las siguientes variables en `.env.local`:

```env
# Firebase Configuration (REQUERIDO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary Configuration (OPCIONAL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_secret

# Security (REQUERIDO)
TOKEN_SECRET=tu_secreto_seguro_32_caracteres

# Application Configuration (REQUERIDO)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Configurar Firebase

1. Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password y Google)
3. Crea una base de datos Firestore
4. Configura las reglas de seguridad (ver `firestore.rules`)
5. Habilita Storage si vas a usar imágenes

## 🚀 Despliegue

Para una guía completa paso a paso de configuración de Firebase Console y despliegue en Render, consulta:

📖 **[Guía de Despliegue Completa](docs/DEPLOYMENT_GUIDE.md)**

### Despliegue Rápido

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

La aplicación estará disponible en `http://localhost:3005`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── api/               # Rutas API
│   ├── client/            # Páginas para alumnos
│   ├── trainer/           # Páginas para entrenadores
│   └── (dashboard)/       # Dashboard principal
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizables
│   ├── navigation/       # Componentes de navegación
│   └── ...
├── lib/                  # Utilidades y configuración
│   ├── hooks/           # Hooks personalizados
│   ├── utils/           # Funciones utilitarias
│   ├── config/          # Configuración
│   └── ...
└── types/               # Definiciones de TypeScript
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Construye para producción
npm start               # Inicia servidor de producción

# Calidad de Código
npm run lint             # Ejecuta ESLint
npm run type-check      # Verificación de tipos TypeScript
npm run format           # Formatea código con Prettier
```

## 🎨 Personalización

### Colores y Tema
Los colores están configurados en `tailwind.config.js`:
- Primary: Púrpila (#8b5cf6)
- Success: Verde (#22c55e)
- Warning: Amarillo (#f59e0b)
- Error: Rojo (#ef4444)

### Localización Argentina
La aplicación está configurada para Argentina:
- Moneda: Pesos Argentinos (ARS)
- Formato de fechas: DD/MM/YYYY
- Zona horaria: America/Argentina/Buenos_Aires
- Impuestos: IVA 21%, Ganancias 35%, Ingresos Brutos 3%

## 🔐 Seguridad

- Autenticación con Firebase Auth
- Reglas de seguridad en Firestore
- Validación de inputs en cliente y servidor
- Manejo seguro de tokens
- Protección contra CSRF y XSS

## 📱 PWA y Mobile

La aplicación es una PWA progresiva:
- Instalable en dispositivos móviles
- Funciona offline parcialmente
- Notificaciones push (configurable)
- Diseño responsive

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores
```bash
# Construir
npm run build

# La carpeta .next contiene el build optimizado
```

### Variables de Entorno de Producción
- `NODE_ENV=production`
- `NEXT_PUBLIC_BASE_URL=https://tu-dominio.com`
- Configurar dominios personalizados en Firebase

## 🧪 Pruebas

```bash
# Verificación de tipos
npm run type-check

# Linting
npm run lint

# Pruebas manuales
npm run dev
```

## 📊 Monitoreo y Analytics

La aplicación incluye:
- Manejo centralizado de errores
- Métricas de rendimiento
- Registro de eventos importantes
- Optimización automática de imágenes

## 🤝 Contribuir

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.

## 🆘 Soporte

Para soporte técnico:
- Revisar la documentación
- Verificar configuración de variables de entorno
- Consultar logs de errores en la consola
- Contactar al equipo de desarrollo

## 🔄 Actualizaciones

La aplicación se actualiza automáticamente con:
- Optimización de rendimiento
- Parches de seguridad
- Nuevas funcionalidades
- Mejoras de UX/UI

---

**LuminaFit** - Transformando vidas a través del entrenamiento personal 🏋️‍♂️
