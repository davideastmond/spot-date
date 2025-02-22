import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const useFirebaseAdmin = () => {
  const serviceAccount: string = process.env.GOOGLE_APPLICATION_CREDENTIALS!;

  const fireStoreApp =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert(JSON.parse(serviceAccount)),
        });

  const db = getFirestore(fireStoreApp);
  const messaging = getMessaging(fireStoreApp);
  return {
    db,
    messaging,
  };
};

export default useFirebaseAdmin;
