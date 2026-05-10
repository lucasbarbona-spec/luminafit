/**
 * Script de Migración de Datos Mock a Firestore
 * 
 * Este script migra los datos mock de la aplicación a Firestore.
 * Es opcional y solo se debe ejecutar si tienes datos existentes que quieres migrar.
 * 
 * REQUISITOS PREVIOS:
 * 1. Instalar firebase-admin: npm install firebase-admin
 * 2. Descargar service account key de Firebase Console
 * 3. Guardar como scripts/service-account-key.json
 * 
 * USO:
 * 1. Configura tus credenciales de Firebase en .env.local
 * 2. Ejecuta: npx tsx scripts/migrate-mock-data.ts
 * 3. Revisa los datos en Firebase Console
 */

// Nota: Este script requiere firebase-admin que no está instalado por defecto
// Descomenta las siguientes líneas después de instalar firebase-admin
// import { initializeApp, getApps, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import serviceAccount from './service-account-key.json';

// Inicializar Firebase Admin (descomentar después de instalar firebase-admin)
// if (!getApps().length) {
//   initializeApp({
//     credential: cert(serviceAccount),
//   });
// }
//
// const db = getFirestore();

// Datos mock de alumnos
const mockAlumnos = [
  {
    nombre: 'María González',
    email: 'maria@example.com',
    telefono: '+5491112345678',
    fechaInicio: new Date('2024-01-15'),
    estado: 'activo',
    objetivos: ['Pérdida de peso', 'Mejorar resistencia'],
    notas: 'Muy comprometida con el entrenamiento',
    fotoUrl: '',
    fechaNacimiento: new Date('1990-05-20'),
    genero: 'femenino',
    altura: 165,
    peso: 70,
  },
  {
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '+5491198765432',
    fechaInicio: new Date('2024-02-01'),
    estado: 'activo',
    objetivos: ['Ganar masa muscular', 'Fuerza'],
    notas: 'Avanza constantemente',
    fotoUrl: '',
    fechaNacimiento: new Date('1988-08-10'),
    genero: 'masculino',
    altura: 180,
    peso: 85,
  },
  {
    nombre: 'Ana Martínez',
    email: 'ana@example.com',
    telefono: '+5491155555555',
    fechaInicio: new Date('2024-02-15'),
    estado: 'activo',
    objetivos: ['Flexibilidad', 'Bienestar general'],
    notas: '',
    fotoUrl: '',
    fechaNacimiento: new Date('1995-03-25'),
    genero: 'femenino',
    altura: 170,
    peso: 60,
  },
];

// Datos mock de rutinas
const mockRutinas = [
  {
    nombre: 'Rutina de Fuerza Avanzada',
    descripcion: 'Programa completo de entrenamiento de fuerza para nivel intermedio',
    semanas: 8,
    estado: 'activa',
    bloques: [
      {
        id: 'bloque-1',
        nombre: 'Pierna',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-1',
            nombre: 'Sentadillas con barra',
            series: 4,
            repeticiones: '12',
            intensidad: 'Alta',
            pause: 90,
            pausa: 90,
            notas: 'Mantener espalda recta',
            musculosPrincipales: ['Cuádriceps', 'Glúteos'],
            equipo: 'Barra',
          },
          {
            id: 'ej-2',
            nombre: 'Prensa de piernas',
            series: 4,
            repeticiones: '15',
            intensidad: 'Media',
            pause: 60,
            pausa: 60,
            notas: '',
            musculosPrincipales: ['Cuádriceps'],
            equipo: 'Máquina',
          },
        ],
      },
      {
        id: 'bloque-2',
        nombre: 'Pecho',
        orden: 2,
        ejercicios: [
          {
            id: 'ej-3',
            nombre: 'Press de banca',
            series: 4,
            repeticiones: '10',
            intensidad: 'Alta',
            pause: 90,
            pausa: 90,
            notas: '',
            musculosPrincipales: ['Pectorales', 'Tríceps'],
            equipo: 'Barra',
          },
        ],
      },
    ],
  },
  {
    nombre: 'Cardio Intenso',
    descripcion: 'Sesiones de cardio de alta intensidad',
    semanas: 4,
    estado: 'activa',
    bloques: [
      {
        id: 'bloque-1',
        nombre: 'HIIT',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-4',
            nombre: 'Burpees',
            series: 3,
            repeticiones: '15',
            intensidad: 'Alta',
            pause: 45,
            pausa: 45,
            notas: 'Mantener ritmo constante',
            musculosPrincipales: ['Full body'],
            equipo: 'Ninguno',
          },
        ],
      },
    ],
  },
];

// Funciones de migración (descomentar después de instalar firebase-admin)
// async function migrateAlumnos(trainerId: string) {
//   console.log('Migrando alumnos...');
//   
//   for (const alumno of mockAlumnos) {
//     try {
//       const docRef = await db
//         .collection('trainers')
//         .doc(trainerId)
//         .collection('alumnos')
//         .add({
//           ...alumno,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       console.log(`✅ Alumno migrado: ${alumno.nombre} (ID: ${docRef.id})`);
//     } catch (error) {
//       console.error(`❌ Error migrando alumno ${alumno.nombre}:`, error);
//     }
//   }
// }
//
// async function migrateRutinas(trainerId: string) {
//   console.log('Migrando rutinas...');
//   
//   for (const rutina of mockRutinas) {
//     try {
//       const docRef = await db
//         .collection('trainers')
//         .doc(trainerId)
//         .collection('rutinas')
//         .add({
//           ...rutina,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       console.log(`✅ Rutina migrada: ${rutina.nombre} (ID: ${docRef.id})`);
//     } catch (error) {
//       console.error(`❌ Error migrando rutina ${rutina.nombre}:`, error);
//     }
//   }
// }
//
// async function main() {
//   console.log('🚀 Iniciando migración de datos mock a Firestore...\n');
//   
//   // Reemplaza con el ID del trainer real
//   const trainerId = process.env.TRAINER_ID || 'default-trainer-id';
//   
//   if (trainerId === 'default-trainer-id') {
//     console.error('❌ Error: Debes especificar un TRAINER_ID válido');
//     console.log('Uso: TRAINER_ID=tu_id npx tsx scripts/migrate-mock-data.ts');
//     process.exit(1);
//   }
//   
//   try {
//     await migrateAlumnos(trainerId);
//     await migrateRutinas(trainerId);
//     
//     console.log('\n✅ Migración completada exitosamente!');
//     console.log('📊 Revisa los datos en Firebase Console');
//   } catch (error) {
//     console.error('\n❌ Error durante la migración:', error);
//     process.exit(1);
//   }
// }
//
// main();
