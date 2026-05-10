import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadUserProfileImage = async (
  userId: string,
  file: File,
  fileName?: string
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'user_profile_preset');
    formData.append('folder', `users/${userId}/profile`);
    formData.append('public_id', fileName || `${userId}_${Date.now()}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data: UploadApiResponse = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    throw new Error('Error al subir la imagen de perfil');
  }
};

export const uploadProgressPhoto = async (
  trainerId: string,
  alumnoId: string,
  file: File,
  fileName?: string
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'progress_photo_preset');
    formData.append('folder', `trainers/${trainerId}/alumnos/${alumnoId}/progress`);
    formData.append('public_id', fileName || `${alumnoId}_${Date.now()}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data: UploadApiResponse = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    throw new Error('Error al subir la foto de progreso');
  }
};

export const uploadExerciseImage = async (
  trainerId: string,
  exerciseId: string,
  file: File,
  fileName?: string
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'exercise_preset');
    formData.append('folder', `trainers/${trainerId}/exercises/${exerciseId}`);
    formData.append('public_id', fileName || `${exerciseId}_${Date.now()}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data: UploadApiResponse = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    throw new Error('Error al subir la imagen del ejercicio');
  }
};

export const uploadSharedFile = async (
  file: File,
  fileName?: string
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shared_file_preset');
    formData.append('folder', 'shared');
    formData.append('public_id', fileName || `shared_${Date.now()}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error al subir el archivo');
    }

    const data: UploadApiResponse = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    throw new Error('Error al subir el archivo compartido');
  }
};

export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Error al eliminar el archivo');
  }
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB (Cloudinary permite más)

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'El archivo debe ser una imagen (JPEG, PNG, WebP o GIF)',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'La imagen no debe superar los 10MB',
    };
  }

  return { valid: true };
};

export const compressImage = async (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al comprimir la imagen'));
            }
          },
          file.type,
          quality
        );
      } else {
        reject(new Error('Error al obtener el contexto del canvas'));
      }
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = URL.createObjectURL(file);
  });
};
