export type MaintenanceRecord = {
  id: string;
  title: string;
  date: string;
  mileage: number;
  cost: number;
  notes: string;
  nextDueMileage?: number;
  nextDueDate?: string;
};