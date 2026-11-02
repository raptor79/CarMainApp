import type { MaintenanceRecord } from './maintenanceStorage.types';

const storageKey = 'car-maintenance-records';

export const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  const savedRecords = window.localStorage.getItem(storageKey);
  return savedRecords ? JSON.parse(savedRecords) as MaintenanceRecord[] : [];
};

export const saveMaintenanceRecord = async (record: MaintenanceRecord): Promise<void> => {
  const records = await getMaintenanceRecords();
  const updatedRecords = [...records.filter((savedRecord) => savedRecord.id !== record.id), record];
  window.localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
};

export const removeMaintenanceRecord = async (id: string): Promise<void> => {
  const records = await getMaintenanceRecords();
  window.localStorage.setItem(
    storageKey,
    JSON.stringify(records.filter((record) => record.id !== id)),
  );
};

export const deleteAllMaintenanceRecords = async (): Promise<void> => {
  window.localStorage.removeItem(storageKey);
};