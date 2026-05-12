'use client';

import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa9yL9qNZMqZbXuGK3fNhSYq9eLWnqunk",
  authDomain: "luminafit-production.firebaseapp.com",
  projectId: "luminafit-production",
  messagingSenderId: "31252551333",
  appId: "1:31252551333:web:2de100c055e8202bbb5f4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Iniciando sign in con Google...');
      const result = await signInWithPopup(auth, provider);
      console.log('Usuario autenticado:', result.user);
      setUser(result.user);
    } catch (error: any) {
      console.error('Error detallado signing in:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      
      // Mostrar mensaje específico según el error
      if (error.code === 'auth/popup-closed-by-user') {
        alert('La ventana de autenticación fue cerrada. Por favor intenta nuevamente.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('La ventana emergente fue bloqueada. Por favor permite ventanas emergentes para este sitio.');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('Dominio no autorizado. Contacta al administrador.');
      } else {
        alert(`Error de autenticación: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LuminaFit</h1>
          <p className="text-gray-600">Plataforma de Entrenamiento Profesional</p>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenido, {user.displayName || user.email}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{user.email}</p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Ir al Dashboard
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Características Principales</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rutinas personalizadas</li>
                <li>• Seguimiento de progreso</li>
                <li>• Entrenadores profesionales</li>
                <li>• Marketplace de ejercicios</li>
              </ul>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Iniciar con Google
                </>
              )}
            </button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Al iniciar sesión, aceptas nuestros términos y condiciones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
