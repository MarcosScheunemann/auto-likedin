import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { auth, database, firestore } from 'firebase-admin';


@Injectable()
export class FirebaseService implements OnModuleInit {
    private static default: FirebaseService;

    // #region Public Accessors (3)

    public get auth(): auth.Auth {
        return auth();
    }

    public get database() {
        return database();
    }

    public get firestore() {
        return firestore();
    }

    constructor() {
        if (!FirebaseService.default) {
            this.onModuleInit();
            FirebaseService.default = this;
        }
    }
    // #endregion Public Accessors (3)

    // #region Public Methods (4)

    public arrayRemove(item: any): FirebaseFirestore.FieldValue {
        return admin.firestore.FieldValue.arrayRemove(item);
    }

    public arrayUnion(item: any): FirebaseFirestore.FieldValue {
        return admin.firestore.FieldValue.arrayUnion(item);
    }

    public increaser(step: number): FirebaseFirestore.FieldValue {
        return admin.firestore.FieldValue.increment(step);
    }

    public onModuleInit() {
        Logger.log(':::::: STARTING FIREBASE ::::::');
        // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
        if (!admin.apps.length) {
            // admin.initializeApp({
            //     credential: admin.credential.cert(serviceAccount),
            //     databaseURL: process.env.DATABASE_URL || '',
            //     storageBucket: process.env.STORAGE_BUCKET || '',
            // });
            // Logger.log(':::::: FIREBASE STARTED ::::::');
            Logger.log(':::::: FIREBASE PRECISA SER FEITO ::::::');
        } else {
            Logger.log(':::::: FIREBASE ALREADY INITIALIZED ::::::');
        }
    }

}
