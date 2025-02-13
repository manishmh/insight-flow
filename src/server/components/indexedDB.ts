const DB_NAME = 'MyDatabase';
const STORE_NAME = 'SampleData';

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('nameIndex', 'name', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveData = async (id: string, name: string, jsonData: any): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Check if ID already exists
  const existingData = await new Promise((resolve) => {
    const request = store.get(id);
    request.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    request.onerror = () => resolve(null);
  });

  if (existingData) {
    console.error('Error: ID already exists');
    return; // Prevent overwriting existing data
  }

  store.add({ id, name, jsonData });

  transaction.oncomplete = () => {
    console.log('Data saved successfully');
  };

  transaction.onerror = (event) => {
    console.error('Error saving data:', (event.target as IDBRequest).error);
  };
};


export const fetchDataByName = async (name: string): Promise<any | null> => {
  console.log("Fetching data by name:", name);
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const index = store.index('nameIndex');

  return new Promise((resolve, reject) => {
    const request = index.get(name);
    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;
      resolve(result ?? null); // Explicitly return null if no data
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};


export const fetchAllData = async (): Promise<any[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};