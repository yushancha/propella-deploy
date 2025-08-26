// IndexedDB data access layer
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
          
          // Create timestamp index for sorting
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
      
      // Get all records and sort by timestamp in descending order
      const request = index.getAll();
      
      request.onsuccess = () => {
        const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`Loaded ${results.length} generations from IndexedDB`);
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Error loading generations:', request.error);
        reject(new Error('Could not load generations from database'));
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
        console.log(`Loaded ${results.length} generations with style '${style}'`);
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Error loading generations by style:', request.error);
        reject(new Error('Could not load generations by style from database'));
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
        console.log('Generation deleted from IndexedDB:', id);
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

  async getGenerationCount(): Promise<number> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();
      
      request.onsuccess = () => {
        console.log(`Generation count: ${request.result}`);
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error getting generation count:', request.error);
        reject(new Error('Could not get generation count from database'));
      };
    });
  }

  async searchGenerations(query: string): Promise<GenerationRecord[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const results = request.result.filter(record => 
          record.name.toLowerCase().includes(query.toLowerCase()) ||
          record.style.toLowerCase().includes(query.toLowerCase()) ||
          record.level.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log(`Found ${results.length} generations matching '${query}'`);
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Error searching generations:', request.error);
        reject(new Error('Could not search generations in database'));
      };
    });
  }
}

// Export singleton instance
export const propellaDB = new PropellaDB();

// Compatibility check
export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

// Migrate localStorage data to IndexedDB
export async function migrateFromLocalStorage(): Promise<void> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, skipping migration');
    return;
  }

  try {
    const localHistory = localStorage.getItem('history');
    if (localHistory) {
      const data = JSON.parse(localHistory);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`Migrating ${data.length} records from localStorage to IndexedDB`);
        
        for (const record of data) {
          try {
            await propellaDB.addGeneration({
              name: record.name || '',
              style: record.style || '',
              level: record.level || '',
              imageUrl: record.imageUrl || '',
              prompt: record.prompt,
              model: record.model,
              size: record.size
            });
          } catch (error) {
            console.warn('Failed to migrate record:', record, error);
          }
        }
        
        // Clear old data after successful migration
        localStorage.removeItem('history');
        console.log('Migration completed successfully');
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

export type { GenerationRecord };

