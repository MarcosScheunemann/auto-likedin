import { auth, database, firestore } from 'firebase-admin';
export interface IFirebaseService {
    auth: auth.Auth;
    firestore: firestore.Firestore;

    database: database.Database;

    increaser(step: number): FirebaseFirestore.FieldValue;
    arrayUnion(item: any): FirebaseFirestore.FieldValue;
    arrayRemove(item: any): FirebaseFirestore.FieldValue;
}
