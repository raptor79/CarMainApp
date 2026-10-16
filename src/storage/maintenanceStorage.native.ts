import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import type { MaintenanceRecord } from './maintenanceStorage.types';

const databaseName = 'maintenance.db';
const encryptionKeyName = 'maintenance-database-key';

type MaintenanceRow = {
  id: string;
  title: string;
  date: string;
  mileage: number;
  cost: number;
  notes: string;
  next_due_mileage: number | null;
  next_due_date: string | null;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

const getDatabase = () => {
  if (!databasePromise) {
    databasePromise = (async () => {
      const database = await SQLite.openDatabaseAsync(databaseName);
      let encryptionKey = await SecureStore.getItemAsync(encryptionKeyName);

      if (!encryptionKey) {
        encryptionKey = `${Crypto.randomUUID()}${Crypto.randomUUID()}`;
        await SecureStore.setItemAsync(encryptionKeyName, encryptionKey);
      }

      await database.execAsync(`
        PRAGMA key = '${encryptionKey}';
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS maintenance_records (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          mileage INTEGER NOT NULL,
          cost REAL NOT NULL,
          notes TEXT NOT NULL,
          next_due_mileage INTEGER,
          next_due_date TEXT
        );
      `);

      return database;
    })().catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
};

const fromRow = (row: MaintenanceRow): MaintenanceRecord => ({
  id: row.id,
  title: row.title,
  date: row.date,
  mileage: row.mileage,
  cost: row.cost,
  notes: row.notes,
  nextDueMileage: row.next_due_mileage ?? undefined,
  nextDueDate: row.next_due_date ?? undefined,
});

export const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync<MaintenanceRow>(
    'SELECT * FROM maintenance_records ORDER BY date DESC, mileage DESC',
  );
  return rows.map(fromRow);
};

export const saveMaintenanceRecord = async (record: MaintenanceRecord): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO maintenance_records (
      id, title, date, mileage, cost, notes, next_due_mileage, next_due_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      date = excluded.date,
      mileage = excluded.mileage,
      cost = excluded.cost,
      notes = excluded.notes,
      next_due_mileage = excluded.next_due_mileage,
      next_due_date = excluded.next_due_date`,
    record.id,
    record.title,
    record.date,
    record.mileage,
    record.cost,
    record.notes,
    record.nextDueMileage ?? null,
    record.nextDueDate ?? null,
  );
};

export const removeMaintenanceRecord = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM maintenance_records WHERE id = ?', id);
};

export const deleteAllMaintenanceRecords = async (): Promise<void> => {
  const database = await getDatabase();
  await database.closeAsync();
  databasePromise = undefined;
  await SQLite.deleteDatabaseAsync(databaseName);
  await SecureStore.deleteItemAsync(encryptionKeyName);
};