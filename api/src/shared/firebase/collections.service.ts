import { Injectable } from '@nestjs/common';
import { auth, database, storage } from 'firebase-admin';
import { IFirebaseService } from './fire.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class CollectionsService {
    // #region Properties (1)

    public firebaseService: IFirebaseService = new FirebaseService();

    // #endregion Properties (1)

    // #region Constructors (1)

    constructor() {
        if (!this.firebaseService) {
            this.firebaseService = new FirebaseService();
        }
    }

    // #endregion Constructors (1)

    // #region Public Accessors (3)

    public get auth(): auth.Auth {
        return this.firebaseService.auth;
    }

    public get database(): database.Database {
        return this.firebaseService.database;
    }

    public get db(): FirebaseFirestore.Firestore {
        return this.firebaseService.firestore;
    }

    // #endregion Public Accessors (3)

    // #region Public Methods (5)

    public arrayRemove(item: any) {
        return this.firebaseService.arrayRemove(item);
    }

    public arrayUnion(item: any) {
        return this.firebaseService.arrayUnion(item);
    }

    public fireStorage(): storage.Storage {
        return storage();
    }

    public increaser(step = 1) {
        return this.firebaseService.increaser(step);
    }

    public sanitizeDate<T>(obj: any) {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') {
                if (obj[key].constructor.name === 'Timestamp') {
                    obj[key] = obj[key].toDate();
                } else { this.sanitizeDate(obj[key]); }
            }
        });
        return obj as T;
    }

    // #endregion Public Methods (5)
}
