#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Verifica que todas las configuraciones necesarias estén correctas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración pre-despliegue...\n');

// Verificar archivos requeridos
const requiredFiles = [
  '.env.local',
  'package.json',
  'next.config.js',
  'firestore.rules'
];

console.log('📁 Verificando archivos requeridos:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ Faltan archivos requeridos. Revisa la instalación.');
  process.exit(1);
}

// Verificar variables de entorno
console.log('\n🔐 Verificando variables de entorno:');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'TOKEN_SECRET',
  'NEXT_PUBLIC_BASE_URL'
];

let allEnvVarsSet = true;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const isSet = value && value.trim() !== '' && !value.includes('tu_') && !value.includes('change-in-production') && !value.includes('andrea-training-secret-key');
  console.log(`${isSet ? '✅' : '❌'} ${envVar}`);
  if (!isSet) allEnvVarsSet = false;
});

// Verificar TOKEN_SECRET
const tokenSecret = process.env.TOKEN_SECRET;
if (tokenSecret && tokenSecret.length < 32) {
  console.log('⚠️  TOKEN_SECRET debería tener al menos 32 caracteres');
}

// Verificar NEXT_PUBLIC_BASE_URL
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (baseUrl && baseUrl.includes('localhost')) {
  console.log('⚠️  NEXT_PUBLIC_BASE_URL apunta a localhost - actualiza para producción');
}

if (!allEnvVarsSet) {
  console.log('\n❌ Variables de entorno faltantes o no configuradas.');
  console.log('Revisa el archivo .env.local y configura todas las variables requeridas.');
  process.exit(1);
}

// Verificar dependencias
console.log('\n📦 Verificando dependencias:');
const packageJson = require('../package.json');
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'firebase'
];

let allDepsInstalled = true;
requiredDeps.forEach(dep => {
  const isInstalled = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`${isInstalled ? '✅' : '❌'} ${dep}`);
  if (!isInstalled) allDepsInstalled = false;
});

if (!allDepsInstalled) {
  console.log('\n❌ Dependencias faltantes. Ejecuta: npm install');
  process.exit(1);
}

console.log('\n🎉 ¡Configuración verificada correctamente!');
console.log('\n📋 Próximos pasos:');
console.log('1. Asegúrate de que Firebase esté configurado correctamente');
console.log('2. Ejecuta: npm run build');
console.log('3. Si el build es exitoso, puedes desplegar');
console.log('4. Consulta docs/DEPLOYMENT_GUIDE.md para el despliegue completo');