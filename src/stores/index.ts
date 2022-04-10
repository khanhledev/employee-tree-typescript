import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { Employees, AssignPayload } from '../types';

export const useEmployeesStore = defineStore('employees', () => {
  const employees: Ref<Array<Employees>> = ref([])
  const add = (data: Employees) => {
    employees.value.push(data);
  }

  const assign = (data: AssignPayload) => {
    const employee = employees.value.find((e: Employees) => e.id === data.employeeId) as Employees;
    if (employee) {
      employee.supervised_by = data.supervisorId;
    }
  }

  return { employees, add, assign }
})