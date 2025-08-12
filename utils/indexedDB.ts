// IndexedDB 数据访问层
interface GenerationRecord {
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
          
          // 创建时间戳索引用于排序
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
      
      request.onsuccess = () => {
        console.log('Generation added to IndexedDB:', record.id);
        resolve(record);
      };
      
      request.onerror = () => {
        console.error('Error adding generation:', request.error);
        reject(new Error('Could not add generation to database'));
      };
    });
  }

  async getAllGenerations(): Promise<GenerationRecord[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      
      // 获取所有记录并按时间戳降序排列
      const request = index.getAll();
      
      request.onsuccess = () => {
        const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`Loaded ${results.length} generations from IndexedDB`);
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Error fetching generations:', request.error);
        reject(new Error('Could not fetch generations from database'));
      };
    });
  }

  async deleteGeneration(id: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log(`Generation ${id} deleted from IndexedDB`);
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error deleting generation:', request.error);
        reject(new Error('Could not delete generation from database'));
      };
    });
  }

  async clearAllGenerations(): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('All generations cleared from IndexedDB');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error clearing generations:', request.error);
        reject(new Error('Could not clear generations from database'));
      };
    });
  }

  async getGenerationsByStyle(style: string): Promise<GenerationRecord[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('style');
      const request = index.getAll(style);
      
      request.onsuccess = () => {
        const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Error fetching generations by style:', request.error);
        reject(new Error('Could not fetch generations by style'));
      };
    });
  }
}

// 导出单例实例
export const propellaDB = new PropellaDB();
export type { GenerationRecord };

// 兼容性检查
export const isIndexedDBSupported = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

// 迁移 localStorage 数据到 IndexedDB
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
      
      // 清除旧数据
      localStorage.removeItem('history');
      console.log('Successfully migrated localStorage data to IndexedDB');
    }
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};

