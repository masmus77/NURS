import { openDB, DBSchema } from 'idb';
import type { ArchiveFile, Kader, Report } from '../types';

const DB_NAME = 'NURantingSystemDB';
const DB_VERSION = 1;

interface AppDB extends DBSchema {
  digitalArchive: {
    key: string;
    value: ArchiveFile;
    indexes: { 'category': string };
  };
  kaderMap: {
    key: string;
    value: Kader;
    indexes: { 'position': string, 'expertise': string, 'interests': string };
  };
  reports: {
    key: string;
    value: Report;
    indexes: { 'year': number };
  };
}

const dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('digitalArchive')) {
      const store = db.createObjectStore('digitalArchive', { keyPath: 'id' });
      store.createIndex('category', 'category');
    }
    if (!db.objectStoreNames.contains('kaderMap')) {
      const store = db.createObjectStore('kaderMap', { keyPath: 'id' });
      store.createIndex('position', 'position');
      store.createIndex('expertise', 'expertise');
      store.createIndex('interests', 'interests');
    }
    if (!db.objectStoreNames.contains('reports')) {
      const store = db.createObjectStore('reports', { keyPath: 'id' });
      store.createIndex('year', 'year');
    }
  },
});

// Digital Archive Operations
export const addFile = async (file: ArchiveFile) => {
    try {
        return await (await dbPromise).add('digitalArchive', file);
    } catch (error) {
        console.error("IndexedDB Error on addFile:", error);
        throw error;
    }
};
export const getFiles = async () => {
    try {
        return await (await dbPromise).getAll('digitalArchive');
    } catch (error) {
        console.error("IndexedDB Error on getFiles:", error);
        throw error;
    }
};
export const getFileById = async (id: string) => {
    try {
        return await (await dbPromise).get('digitalArchive', id);
    } catch (error) {
        console.error(`IndexedDB Error on getFileById (id: ${id}):`, error);
        throw error;
    }
};
export const deleteFile = async (id: string) => {
    try {
        return await (await dbPromise).delete('digitalArchive', id);
    } catch (error) {
        console.error(`IndexedDB Error on deleteFile (id: ${id}):`, error);
        throw error;
    }
};

// Kader Map Operations
export const addKader = async (kader: Kader) => {
    try {
        return await (await dbPromise).add('kaderMap', kader);
    } catch (error) {
        console.error("IndexedDB Error on addKader:", error);
        throw error;
    }
};
export const getKader = async () => {
    try {
        return await (await dbPromise).getAll('kaderMap');
    } catch (error) {
        console.error("IndexedDB Error on getKader:", error);
        throw error;
    }
};
export const getKaderById = async (id: string) => {
    try {
        return await (await dbPromise).get('kaderMap', id);
    } catch (error) {
        console.error(`IndexedDB Error on getKaderById (id: ${id}):`, error);
        throw error;
    }
};
export const updateKader = async (kader: Kader) => {
    try {
        return await (await dbPromise).put('kaderMap', kader);
    } catch (error) {
        console.error(`IndexedDB Error on updateKader (id: ${kader.id}):`, error);
        throw error;
    }
};
export const deleteKader = async (id: string) => {
    try {
        return await (await dbPromise).delete('kaderMap', id);
    } catch (error) {
        console.error(`IndexedDB Error on deleteKader (id: ${id}):`, error);
        throw error;
    }
};

// Report Operations
export const addReport = async (report: Report) => {
    try {
        return await (await dbPromise).add('reports', report);
    } catch (error) {
        console.error("IndexedDB Error on addReport:", error);
        throw error;
    }
};
export const getReports = async () => {
    try {
        return await (await dbPromise).getAll('reports');
    } catch (error) {
        console.error("IndexedDB Error on getReports:", error);
        throw error;
    }
};
export const getReportById = async (id: string) => {
    try {
        return await (await dbPromise).get('reports', id);
    } catch (error) {
        console.error(`IndexedDB Error on getReportById (id: ${id}):`, error);
        throw error;
    }
};
export const deleteReport = async (id: string) => {
    try {
        return await (await dbPromise).delete('reports', id);
    } catch (error) {
        console.error(`IndexedDB Error on deleteReport (id: ${id}):`, error);
        throw error;
    }
};
export const getReportsByYear = async (year: number) => {
    try {
        return await (await dbPromise).getAllFromIndex('reports', 'year', year);
    } catch (error) {
        console.error(`IndexedDB Error on getReportsByYear (year: ${year}):`, error);
        throw error;
    }
};