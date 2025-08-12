// IndexedDB 数据访问层
export interface GenerationRecord {
  id: string;
  name: string;
  style: string;
  level: string;
  imageUrl: string;
  timestamp: number;
  prompt?: string;
  model?: string;
  size?: string;
}

class PropellaDB {
  private dbName = 'PropellaDB';
  private version = 1;
  private storeName = 'generations';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(new Error('Error opening database'));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'id'
          });
          
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('style', 'style', { unique: false });
          
          console.log('Object store and indexes created');
        }
      };
    });
  }

  async addGeneration(generationData: Omit<GenerationRecord, 'id' | 'timestamp'>): Promise<GenerationRecord> {
    await this.init();
    
    const record: GenerationRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...generationData
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(record);

      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllGenerations(): Promise<GenerationRecord[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.getAll();

      request.onsuccess = () => {
        const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteGeneration(id: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const propellaDB = new PropellaDB();

export const isIndexedDBSupported = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

export const migrateFromLocalStorage = async (): Promise<void> => {
  if (!isIndexedDBSupported()) return;
  
  try {
    const localHistory = localStorage.getItem('history');
    if (localHistory) {
      const oldData = JSON.parse(localHistory);
      
      for (const item of oldData) {
        await propellaDB.addGeneration({
          name: item.name || 'Unknown',
          style: item.style || 'pixel',
          level: item.level || 'normal',
          imageUrl: item.url || item.imageUrl
        });
      }
      
      localStorage.removeItem('history');
      console.log('Successfully migrated localStorage data to IndexedDB');
    }
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};