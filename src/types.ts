import { Ref } from 'vue';

export interface Employees {
  id: number;
  name: string;
  supervised_by: string | number;
  title: string;
  children: any;
}

export interface EmployeesStore {
  employees: Ref<Array<Employees>>;
  add(data: any): void;
  assign(data: any): void;
}

export interface DataTable {
  key: string | number;
  id: string | number;
  name: string;
  supervised_by?: string;
}

export interface AssignPayload {
  employeeId: number;
  supervisorId: number;
}