import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

export interface AuthError {
  code: string;
  message: string;
}

export const getAuthErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'La contraseña es incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/popup-closed-by-user': 'Se cerró la ventana de autenticación',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con el mismo correo pero con un método de autenticación diferente',
    'auth/invalid-credential': 'Las credenciales son inválidas',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
  };
  return errorMessages[code] || 'Ocurrió un error durante la autenticación';
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await getUserData(userCredential.user);
    if (!user) {
      throw new Error('No se encontraron datos del usuario');
    }
    return user;
  } catch (error) {
    const firebaseError = error as { code?: string };
    throw new Error(getAuthErrorMessage(firebaseError.code || 'unknown'));
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = await getUserData(userCredential.user);
    if (!user) {
      // Si es la primera vez con Google, crear el documento de usuario
      await createUserData(userCredential.user, 'client');
      const newUser = await getUserData(userCredential.user);
      if (!newUser) {
        throw new Error('Error al crear el usuario');
      }
      return newUser;
    }
    return user;
  } catch (error) {
    const firebaseError = error as { code?: string };
    throw new Error(getAuthErrorMessage(firebaseError.code || 'unknown'));
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string,
  role: 'trainer' | 'client' = 'client'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el perfil del usuario
    await updateProfile(userCredential.user, { displayName });
    
    // Crear documento de usuario en Firestore
    await createUserData(userCredential.user, role);
    
    const user = await getUserData(userCredential.user);
    if (!user) {
      throw new Error('Error al crear el usuario');
    }
    return user;
  } catch (error) {
    const firebaseError = error as { code?: string };
    throw new Error(getAuthErrorMessage(firebaseError.code || 'unknown'));
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('Error al cerrar sesión');
  }
};

const getUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || userData.displayName || '',
        role: userData.role || 'client',
        photoURL: firebaseUser.photoURL || userData.photoURL || '',
      };
    }
    
    // Si no existe el documento, retornar datos básicos de Firebase Auth
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      role: 'client', // Default role
      photoURL: firebaseUser.photoURL || '',
    };
  } catch (error) {
    return null;
  }
};

const createUserData = async (
  firebaseUser: FirebaseUser, 
  role: 'trainer' | 'client'
): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      role: role,
      photoURL: firebaseUser.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const user = await getUserData(firebaseUser);
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};
