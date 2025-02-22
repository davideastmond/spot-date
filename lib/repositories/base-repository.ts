import useFirebaseAdmin from "~/lib/firebase/firebase";
export abstract class BaseRepository {
  protected db: FirebaseFirestore.Firestore;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.db = useFirebaseAdmin().db;
    this.collectionName = collectionName;
  }

  async create$<T>(data: Partial<T>): Promise<string> {
    const doc = await this.db.collection(this.collectionName).add(data);
    return doc.id;
  }

  async getById$<T>(id: string): Promise<T | null> {
    const doc = await this.db.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { ...doc.data(), id: doc.id } as T;
  }
  async get$<T>(): Promise<T[]> {
    const docs = await this.db.collection(this.collectionName).get();
    return docs.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
  }
  query$() {
    return this.db.collection(this.collectionName);
  }
  async update$<T>(id: string, data: Partial<T>): Promise<void> {
    await this.db.collection(this.collectionName).doc(id).update(data);
  }
}
