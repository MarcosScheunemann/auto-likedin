import { IEnvelope, IEnvelopeArray, factoryEnvelope, factoryEnvelopeArray, factoryEnvelopeArrayPagination } from 'scheunemann-interfaces';
import { InternalServerErrorException } from '@nestjs/common';
import { database, firestore } from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { EFirebaseOperator } from 'scheunemann-interfaces';
import { CollectionsService } from '../firebase/collections.service';

export abstract class RepositoryBase<T> {

    public collectionService: CollectionsService;
    public pathBase: string = '';

    // #endregion Properties (5)

    // #region Constructors (1)

    constructor(paths: string[]) {
        this.collectionService = new CollectionsService();
        this.pathBase = paths.reduce((a, b) => {
            const slash = a === '' ? a : '/';
            return a + slash + b;
        }, '');
    }

    // #endregion Constructors (1)

    // #region Public Accessors (4)

    /**
     * Retorna uma referencia para uma coleção em uma loja dentro de um container
     * @param containerId Identidade do container
     * @param companyId identidade da loja
     */
    public get coll() {
        const p = this.collService.db.collection(this.pathBase);
        return p;
    }

    public get collService() {
        return this.collectionService;
    }

    /**
     * Realtime Database
     */
    public get realtime(): any {
        return this.collService.database.ref(this.pathBase);
    }

    /**
     * Gera um GUID sem hifens
     */
    public get uuid(): string {
        const timestamp = Date.now().toString();
        const idParts = uuid().toUpperCase().split('-');
        return `${timestamp.substring(0, 8)}${timestamp.substring(8, 12)}${idParts[0].substring(0, 1)}${idParts[2].substring(1)}${idParts[3]}${idParts[4]}`;
    }

    // #endregion Public Accessors (4)

    // #region Public Methods (27)

    /**
     * Adiciona um item na coleção
     * @param companyInfo Dados do container e da loja onde os dados serão pesquisados
     * @param item item a ser adicionado
     */
    public async add(item: any, customId: string = ''): Promise<IEnvelope<T>> {
        item = this.objectToStringToJson(item);
        item.createdAt = firestore.FieldValue.serverTimestamp();
        item.updatedAt = firestore.FieldValue.serverTimestamp();
        if (item.active === undefined) {
            item.active = true;
        }
        if (!customId) {
            item.id = this.uuid;
        } else {
            item.id = customId;
        }
        await this.coll.doc(item.id).set(item);
        const ret = factoryEnvelope<T>(item);
        return ret;
    }

    /**
     * Adiciona um item a um array de um documento.
     * @param id O ID do documento a ser atualizado.
     * @param field O nome do campo array que será atualizado.
     * @param item O item a ser adicionado ao array.
     */
    public async addToArray(id: string, field: string, item: any): Promise<IEnvelope<T>> {
        // Remove campos que você não deseja que sejam adicionados ao item do array.
        // Certifique-se de que o item esteja formatado corretamente.
        item = this.objectToStringToJson(item);
        // Use arrayUnion para adicionar o item ao campo array.
        await this.coll.doc(id).update({
            [field]: firestore.FieldValue.arrayUnion(item),
        });
        return await this.getById(id);
    }

    /**
     * Retorna uma referencia a um grupo de coleções
     * @param collectionId Nome do grupo de coleções a ser pesquisado
     */
    public collectionGroup(collectionId: string): FirebaseFirestore.CollectionGroup<FirebaseFirestore.DocumentData> {
        return this.collService.db.collectionGroup(collectionId);
    }

    /**
     * Remove um item da base de dados
     * @param id Identidade do item a ser removido
     */
    public async delete(id: string): Promise<void> {
        await this.coll.doc(id).delete();
    }

    /**
     * Busca um produto baseado na sua identidade única no banco de dados
     * @param companyInfo Dados do container e da loja onde os dados serão pesquisados
     * @param id indice do produto
     */
    public async getAll(lastDocId: string | undefined | null = null, limit: number = 50, orderBy: string = 'createdAt'): Promise<IEnvelopeArray<T>> {
        try {
            let basicQuery: firestore.Query | firestore.CollectionReference = this.coll;
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.error(error); // para depuração e logging
            throw new InternalServerErrorException((error as any).message, 'Oops! An error occurred');
        }
    }

    public async getAllWhereEqualInQueryAndArray(
        coll1: string,
        queryArray: string[],
        coll2: string,
        query: string,
        lastDocId: string | undefined | null,
        limit: number = 100,
        orderBy: string = '',
        desc: 'desc' | 'asc' = 'asc'
    ): Promise<IEnvelopeArray<T>> {
        try {
            const c = this.coll;
            let basicQuery = c.where(coll1, 'in', queryArray).where(coll2, '==', query);
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }

            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0014');
        }
    }

    public async getAllWhereQuery(
        coll: string,
        operator: EFirebaseOperator,
        query: any,
        lastDocId: string | undefined | null = null,
        limit: number = 100,
        orderBy: string = '',
        desc: 'desc' | 'asc' = 'desc'
    ): Promise<IEnvelopeArray<T>> {
        try {
            const c = this.coll;
            let basicQuery = c.where(coll, operator, query);
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, desc);
            }
            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            throw new InternalServerErrorException((error as any)?.message, 'EE45');
        }
    }

    public async getAllWhereWhereEqualQuery(
        where: string,
        operator: EFirebaseOperator = EFirebaseOperator.EQUAL,
        query: string | boolean | Array<string>,
        where2: string,
        operator2: EFirebaseOperator = EFirebaseOperator.EQUAL,
        query2: string | string[],
        lastDocId: string | undefined | null = null,
        limit: number = 100,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        try {
            const c = this.coll;
            let basicQuery = c.where(where, operator, query).where(where2, operator2, query2);
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots.docs.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit
            );
            return env;
        } catch (error) {
            throw new InternalServerErrorException((error as any)?.message, 'EE46');
        }
    }

    /**
     * Busca um produto baseado na sua identidade única no banco de dados
     * @param companyInfo Dados do container e da loja onde os dados serão pesquisados
     * @param id indice do produto
     */
    public async getById(id: string): Promise<IEnvelope<T>> {
        try {
            const ref = this.coll.doc(id);
            const refDoc = await ref.get();
            if (!refDoc.exists) {
                return factoryEnvelope<T>(null);
            }
            return factoryEnvelope<T>(this.sanitize(refDoc.data()));
        } catch (error) {
            throw new InternalServerErrorException((error as any)?.message, 'Oops - [00010]');
        }
    }

    public async getByTagContains(
        queryTag: string,
        lastDocId: string | undefined | null,
        limit: number = 50,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        queryTag = queryTag.toUpperCase();
        try {
            const c = this.coll;
            let basicQuery = c.where('tags', 'array-contains', queryTag);
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0013');
        }
    }

    public async getByTagContainsWhere(
        queryTag: string,
        coll: string,
        query: string,
        lastDocId: string | null,
        limit: number = 50,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        queryTag = queryTag.toUpperCase();
        try {
            const c = this.coll;
            let basicQuery = c.where(coll, '==', query).where('tags', 'array-contains', queryTag);
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const lastDoc = await this.coll.doc(lastDocId).get();
                if (lastDoc.exists) {
                    basicQuery = basicQuery.startAfter(lastDoc);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.error(error); // para depuração e logging
            throw new InternalServerErrorException((error as any).message, 'Oops! 0013');
        }
    }

    public async getGroup(
        collectioName: string,
        lastDoc: FirebaseFirestore.DocumentSnapshot | null,
        limit: number = 50,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        try {
            const colls = this.collService.db.collectionGroup(collectioName);
            let basicQuery: firestore.Query | firestore.CollectionReference = colls;
            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDoc) {
                basicQuery = basicQuery.startAfter(lastDoc);
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException((error as any).message, 'Oops! An error occurred');
        }
    }

    public async getGroupById(coll: string, id: string): Promise<IEnvelopeArray<T>> {
        try {
            const ref = await this.collectionGroup(coll).where('id', '==', id).get();
            if (ref.empty) {
                return factoryEnvelopeArray();
            }
            return factoryEnvelopeArray<T>(ref.docs.map((m) => this.sanitize(m.data())));
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0016');
        }
    }

    public async getGroupWhereWhere(
        collectioName: string,
        field1: string,
        query1: string,
        field2: string,
        query2: string,
        lastDocId: string | undefined | null,
        limit: number = 50,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        try {
            const colls = this.collService.db.collectionGroup(collectioName).where(field1, '==', query1).where(field2, '==', query2);
            let basicQuery: firestore.Query | firestore.CollectionReference = colls;

            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const ref = await this.collService.db.collectionGroup(collectioName).where('id', '==', lastDocId).get();
                if (!ref.empty) {
                    basicQuery = basicQuery.startAfter(ref.docs[0]);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException((error as any).message, 'Oops! An error occurred');
        }
    }
    public async getGroupWhere(
        collectioName: string,
        field: string,
        query: string,
        lastDocId: string | undefined | null,
        limit: number = 50,
        orderBy: string = ''
    ): Promise<IEnvelopeArray<T>> {
        try {
            const colls = this.collService.db.collectionGroup(collectioName).where(field, '==', query);
            let basicQuery: firestore.Query | firestore.CollectionReference = colls;

            if (orderBy) {
                basicQuery = basicQuery.orderBy(orderBy, 'desc');
            }
            if (lastDocId) {
                const ref = await this.collService.db.collectionGroup(collectioName).where('id', '==', lastDocId).get();
                if (!ref.empty) {
                    basicQuery = basicQuery.startAfter(ref.docs[0]);
                }
            }
            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException((error as any).message, 'Oops! An error occurred');
        }
    }

    public async memberIn(uid: string): Promise<IEnvelopeArray<T>> {
        try {
            const ref = await this.collectionGroup('members').where('uid', '==', uid).get();
            if (ref.empty) {
                return factoryEnvelopeArray();
            }
            return factoryEnvelopeArray<T>(ref.docs.map((m) => this.sanitize(m.data())));
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0015');
        }
    }

    /**
     * serealiza um objeto para um json sem perder as características do tipo Date
     * @param obj Objeto a ser serealizado
     */
    public objectToStringToJson<T>(obj: any) {
        if (!obj) {
            return null;
        }
        const d = JSON.stringify(obj);
        return this.parseWithDate(d) as T;
    }

    public parseWithDate(json: string) {
        const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/;

        return JSON.parse(json, (key, value) => {
            if (typeof value === 'string' && isoDatePattern.test(value)) {
                return new Date(value);
            }
            return value;
        });
    }

    public async partnerMemberIn(uid: string): Promise<IEnvelopeArray<T>> {
        try {
            const ref = await this.collectionGroup('partner-members').where('uid', '==', uid).get();
            if (ref.empty) {
                return factoryEnvelopeArray();
            }
            return factoryEnvelopeArray<T>(ref.docs.map((m) => this.sanitize(m.data())));
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0015');
        }
    }
    public async customerMemberIn(uid: string): Promise<IEnvelopeArray<T>> {
        try {
            const ref = await this.collectionGroup('customer-members').where('uid', '==', uid).get();
            if (ref.empty) {
                return factoryEnvelopeArray();
            }
            return factoryEnvelopeArray<T>(ref.docs.map((m) => this.sanitize(m.data())));
        } catch (error) {
            throw new InternalServerErrorException(error as any, 'Oops! 0016');
        }
    }

    public async addRealTime(item: any): Promise<IEnvelope<T>> {
        try {
            item = this.objectToStringToJson(item);
            item.createdAt = Date.now();
            item.updatedAt = Date.now();
            if (item.active === undefined) {
                item.active = true;
            }
            item.id = item.id || uuid().replace(/\-/g, '').toUpperCase();
            await this.realtime.child(item.id).set(item);
            const ret = factoryEnvelope<T>(item);
            return ret;
        } catch (error: any) {
            throw Error(`${error.message}`);
        }
    }

    public async updateRealtime(id: string, item: any): Promise<IEnvelope<T>> {
        delete item.active;
        delete item.id;
        delete item.createdAt;
        item = this.objectToStringToJson(item);
        item.updatedAt = Date.now();
        id = id || uuid().replace(/\-/g, '').toUpperCase();
        // item.active = true;  => necessário?
        await this.realtime.child(id).update(item);
        const ret = factoryEnvelope<T>(item);
        return ret;
    }

    public async realtimeDelete(id: string): Promise<void> {
        await this.realtime.child(id).remove();
    }
    public async realtimeWhere(child: string, operation: '==' | '>=' | '<=', value: any, limit: number = 50): Promise<IEnvelopeArray<T>> {
        try {
            let query: database.Query;
            switch (operation) {
                case '==':
                    query = this.realtime.orderByChild(child).equalTo(value).limitToLast(limit);
                    break;
                case '>=':
                    query = this.realtime.orderByChild(child).startAt(value).limitToLast(limit);
                    break;
                case '<=':
                    query = this.realtime.orderByChild(child).endAt(value).limitToLast(limit);
                    break;
            }
            const ref = await query.once('value');
            if (!ref.exists()) {
                return factoryEnvelopeArray<T>();
            }
            const tokens = ref.val();
            const items = [];
            for (const key in tokens) {
                if (Object.prototype.hasOwnProperty.call(tokens, key)) {
                    const element = tokens[key];
                    items.push(element);
                }
            }
            return factoryEnvelopeArray(items);
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0012');
        }
    }
    public async realtimeWhereWhere(
        child1: string,
        operation1: '==' | '>=' | '<=',
        value1: any,
        child2: string,
        operation2: '==' | '>=' | '<=',
        value2: any,
        limit: number = 50
    ): Promise<IEnvelopeArray<T>> {
        try {
            let query: database.Query = this.realtime;

            // Adiciona a primeira condição
            switch (operation1) {
                case '==':
                    query = query.orderByChild(child1).equalTo(value1);
                    break;
                case '>=':
                    query = query.orderByChild(child1).startAt(value1);
                    break;
                case '<=':
                    query = query.orderByChild(child1).endAt(value1);
                    break;
            }
            switch (operation2) {
                case '==':
                    query = query.orderByChild(child2).equalTo(value2);
                    break;
                case '>=':
                    query = query.orderByChild(child2).startAt(value2);
                    break;
                case '<=':
                    query = query.orderByChild(child2).endAt(value2);
                    break;
            }

            query = query.limitToLast(limit);

            const ref = await query.once('value');

            if (!ref.exists()) {
                return factoryEnvelopeArray<T>();
            }

            const tokens = ref.val();
            const items = [];
            for (const key in tokens) {
                if (Object.prototype.hasOwnProperty.call(tokens, key)) {
                    const element = tokens[key];
                    items.push(element);
                }
            }

            return factoryEnvelopeArray(items);
        } catch (error) {
            throw new InternalServerErrorException((error as any).message, 'Oops! 0012');
        }
    }

    /**
     * Normaliza as datas do objeto de Timestamp ou Date
     * @param obj Item a ser normalizado
     */
    public sanitize(obj: any): T {
        if (!obj) {
            return obj;
        }
        return this.collService.sanitizeDate<T>(obj);
    }

    public async subsFromPartner(
        partnerId: string,
        dateS: Date,
        dateE: Date,
        filterBy: 'startDate' | 'endDate' | 'none',
        status: string[],
        lastDocId: string | undefined | null,
        limit: number = 50
    ): Promise<IEnvelopeArray<T>> {
        try {
            const startDate = firestore.Timestamp.fromDate(dateS);
            const endDate = firestore.Timestamp.fromDate(dateE);
            let basicQuery = this.collectionGroup('company-subs').where('partnerId', '==', partnerId).where('status', 'in', status);
            if (filterBy !== 'none' && filterBy !== undefined && filterBy !== null) {
                basicQuery = basicQuery.where(filterBy, '>=', startDate).where(filterBy, '<=', endDate);
            }
            basicQuery = basicQuery.orderBy(filterBy === 'none' ? 'updatedAt' : filterBy, 'desc');
            if (lastDocId) {
                const ref = await this.collectionGroup('company-subs').where('id', '==', lastDocId).get();

                if (!ref.empty) {
                    basicQuery = basicQuery.startAfter(ref.docs[0]);
                }
            }

            basicQuery = basicQuery.limit(limit);
            const snapShots = await basicQuery.get();
            const env = factoryEnvelopeArrayPagination<T>(
                snapShots?.docs?.map((snap: any) => this.collService.sanitizeDate<T>(snap.data())),
                snapShots.docs.length - 1,
                limit,
                snapShots.size
            );
            return env;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException((error as any).message, 'Oops! 0016');
        }
    }

    /**
     * Atualiza dados de um item na coleção
     * @param companyInfo Dados do container e da loja onde os dados serão pesquisados
     * @param item dados a serem atualizados
     */
    public async update(id: string, item: any): Promise<IEnvelope<T>> {
        delete item.active;
        delete item.id;
        delete item.createdAt;
        item.updatedAt = new Date();
        item = this.objectToStringToJson(item);
        const res = await this.coll.doc(id).update(item);
        return await this.getById(id);
    }

}
