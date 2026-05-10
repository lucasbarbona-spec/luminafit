import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import crypto from 'crypto';

admin.initializeApp();

exports.generateShareLink = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { alumnoId, rutinaId } = data;
  const token = crypto.randomBytes(16).toString('hex');

  // Guardar token en Firestore
  await admin.firestore().collection('accessTokens').doc(token).set({
    trainerId: context.auth.uid,
    alumnoId,
    rutinaId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
  });

  return {
    token,
    shareUrl: `${process.env.BASE_URL}/routines/${token}?alumno=${alumnoId}`,
  };
});

exports.validateAccessToken = functions.https.onCall(async (data, context) => {
  const { token } = data;

  const doc = await admin
    .firestore()
    .collection('accessTokens')
    .doc(token)
    .get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'Token not found');
  }

  const tokenData = doc.data()!;
  const now = new Date();

  if (tokenData.expiresAt.toDate() < now) {
    throw new functions.https.HttpsError('permission-denied', 'Token expired');
  }

  return tokenData;
});