import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Configuración de Firebase Admin
// NOTA: Necesitas descargar tu service account key de Firebase Console
// y colocarla en la ruta especificada abajo
const serviceAccount = require('./firebase-service-account.json');

const app = getApps().length === 0 
  ? initializeApp({
      credential: cert(serviceAccount)
    })
  : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

interface TestUser {
  email: string;
  password: string;
  displayName: string;
  role: 'trainer' | 'client';
}

const testUsers: TestUser[] = [
  {
    email: 'trainer@test.com',
    password: 'test123456',
    displayName: 'Entrenador Test',
    role: 'trainer'
  },
  {
    email: 'client@test.com',
    password: 'test123456',
    displayName: 'Cliente Test',
    role: 'client'
  }
];

async function createTestUsers() {
  console.log('🚀 Creando usuarios de prueba...\n');

  for (const user of testUsers) {
    try {
      // Crear usuario en Authentication
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
      });

      console.log(`✅ Usuario creado en Auth: ${user.email} (UID: ${userRecord.uid})`);

      // Crear documento en Firestore
      const userDoc = {
        uid: userRecord.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc);
      console.log(`✅ Documento creado en Firestore: ${user.email}`);

      // Si es entrenador, crear documento en trainers
      if (user.role === 'trainer') {
        await db.collection('trainers').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: user.email,
          displayName: user.displayName,
          especialidad: ['Fuerza', 'Cardio'],
          certificaciones: ['Personal Trainer'],
          alumnos: [],
          createdAt: new Date(),
        });
        console.log(`✅ Documento de entrenador creado: ${user.email}`);
      }

      // Si es cliente, crear datos de prueba
      if (user.role === 'client') {
        await db.collection('users').doc(userRecord.uid).collection('progreso').add({
          fecha: new Date(),
          peso: 70,
          altura: 175,
          notas: 'Registro inicial',
        });
        console.log(`✅ Datos de progreso creados: ${user.email}`);
      }

      console.log('\n---\n');
    } catch (error) {
      console.error(`❌ Error creando usuario ${user.email}:`, error);
    }
  }

  console.log('✨ Usuarios de prueba creados exitosamente!');
  console.log('\nCredenciales de prueba:');
  testUsers.forEach(user => {
    console.log(`\n${user.role.toUpperCase()}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
  });
}

// Ejecutar el script
createTestUsers()
  .then(() => {
    console.log('\n✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });
