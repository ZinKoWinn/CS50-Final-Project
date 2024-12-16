import { Inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp, WhereFilterOp } from 'firebase/firestore';

type ExistenceCallback = (exists: boolean) => void;

@Injectable({
  providedIn: 'root'
})
export class BaseFirebaseCrudService<T> {
  private collection: AngularFirestoreCollection<T>;
  private collectionName: string;

  constructor(private firestore: AngularFirestore, @Inject('collectionName') collectionName: string) {
    this.collectionName = collectionName;
    this.collection = this.firestore.collection<T>(collectionName);
  }

  private handleSnapshot<U>(snapshot: QuerySnapshot<U>): U[] {
    return snapshot.docs.map(doc => {
      const data = doc.data() as U;
      const id = doc.id;
      return { ...data, documentId: id };
    });
  }

  private handleError(error: any): void {
    console.error(`Error in ${this.collectionName}:`, error);
    throw error;
  }

  getCollection(): AngularFirestoreCollection<T> {
    return this.collection;
  }

  getAll(): Observable<T[]> {
    return this.collection.snapshotChanges().pipe(
      map(actions => actions.map(a => ({
        ...a.payload.doc.data() as T,
        documentId: a.payload.doc.id
      })))
    );
  }

  getOne(id: string): Observable<T | undefined> {
    return this.collection.doc<T>(id).valueChanges();
  }

  findByFieldName(field: string, value: any): Observable<T | null> {
    return new Observable(observer => {
      return this.collection.ref.where(field, '==', value).limit(1).onSnapshot(snapshot => {
        const doc = snapshot.docs[0];
        observer.next(doc ? doc.data() as T : null);
      }, error => {
        observer.error(error);
      });
    });
  }

  async add(item: T): Promise<void> {
    try {
      await this.collection.add(item);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async save(id: string, item: T): Promise<void> {
    try {
      return await this.collection.doc(id).set(item);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, item: T): Promise<void> {
    try {
      return await this.collection.doc(id).update(item);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.collection.doc(id).delete();
    } catch (error) {
      return this.handleError(error);
    }
  }

  queryByField(field: string, operator: WhereFilterOp, value: any): Observable<T[]> {
    return new Observable(observer => {
      return this.collection.ref.where(field, operator, value).onSnapshot(snapshot => {
        observer.next(this.handleSnapshot<T>(snapshot));
      }, error => {
        observer.error(error);
      });
    });
  }

  queryByDateBetween(field: string, startDate: Timestamp, endDate: Timestamp): Observable<T[]> {
    return new Observable(observer => {
      return this.collection.ref.where(field, '>=', startDate).where(field, '<=', endDate).onSnapshot(snapshot => {
        observer.next(this.handleSnapshot<T>(snapshot));
      }, error => {
        observer.error(error);
      });
    });
  }

  isAlreadyExist(field: string, operator: WhereFilterOp, value: any, callback: ExistenceCallback): void {
    this.collection.ref.where(field, operator, value).limit(1).get()
      .then(snapshot => {
        const exists = !snapshot.empty;
        callback(exists);
      })
      .catch(error => {
        console.error('Error checking existence:', error);
        callback(false);
      });
  }

  getSubCollection<U>(id: string, subCollectionName: string): AngularFirestoreCollection<U> {
    return this.collection.doc<T>(id).collection<U>(subCollectionName);
  }

  getAllSubCollection<U>(id: string, subCollectionName: string): Observable<U[]> {
    return this.getSubCollection<U>(id, subCollectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => ({
        ...a.payload.doc.data() as U,
        documentId: a.payload.doc.id
      })))
    );
  }

  getOneFromSubCollection<U>(parentId: string, subCollectionName: string, id: string): Observable<U | undefined> {
    return this.getSubCollection<U>(parentId, subCollectionName).doc<U>(id).valueChanges();
  }

  querySubCollectionByField<U>(parentId: string, subCollectionName: string, field: string, operator: WhereFilterOp, value: any): Observable<U[]> {
    return new Observable(observer => {
      return this.getSubCollection<U>(parentId, subCollectionName).ref.where(field, operator, value).onSnapshot(snapshot => {
        observer.next(this.handleSnapshot<U>(snapshot));
      }, error => {
        observer.error(error);
      });
    });
  }

  querySubCollectionByDateBetween<U>(parentId: string, subCollectionName: string, field: string, startDate: Timestamp, endDate: Timestamp): Observable<U[]> {
    return new Observable(observer => {
      return this.getSubCollection<U>(parentId, subCollectionName).ref.where(field, '>=', startDate).where(field, '<=', endDate).onSnapshot(snapshot => {
        observer.next(this.handleSnapshot<U>(snapshot));
      }, error => {
        observer.error(error);
      });
    });
  }

  async addOrUpdateSubCollectionItem<U>(parentId: string, subCollectionName: string, item: U): Promise<void> {
    const documentRef = this.getSubCollection<U>(parentId, subCollectionName).doc<U>(item['id']);
    try {
      return await documentRef.set(item, { merge: true });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteSubCollectionItem<U>(parentId: string, subCollectionName: string, itemId: string): Promise<void> {
    try {
      return await this.getSubCollection<U>(parentId, subCollectionName).doc<U>(itemId).delete();
    } catch (error) {
      return this.handleError(error);
    }
  }
}