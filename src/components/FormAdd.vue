<template>
  <a-form ref="formRef" name="add-employee" :model="employeeInfo" :rules="rules" v-bind="layout"
    @pressEnter="handleFinish" @finish="handleFinish" @validate="handleValidate" @finishFailed="handleFinishFailed">
    <a-form-item label="Employee name" name="name">
      <a-input v-model:value="employeeInfo.name" type="text" autocomplete="off" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">Add</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="data" :pagination="false" bordered>
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        {{ text }}
      </template>
    </template>
    <template #title>Employee list</template>
    </a-table>
</template>
<script lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { defineComponent, reactive, ref, onMounted, Ref } from 'vue';
import { useEmployeesStore } from '../stores/index';
import { DataTable, Employees } from '../types'
import type { FormInstance } from 'ant-design-vue';

interface EmployeeInfo {
  id: string | number;
  name: string;
  supervised_by: string;
  title: string;
  key: string | number;
}

export default defineComponent({
  setup() {
    const employeesStore = useEmployeesStore();
    const formRef = ref<FormInstance>();
    const employeeInfo = reactive<EmployeeInfo>({
      id: 0,
      name: '',
      supervised_by: '',
      title: '',
      key: '',
    });
    const id = ref(0);
    const data: Ref<Array<DataTable>> = ref([]);
    const rules: Record<string, Rule[]> = {
      name: [{ required: true, message: 'Please input name' }],
    };
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
    ];

    const handleFinish = (values: EmployeeInfo) => {
      const isExited = employeesStore.employees.findIndex((employee: Employees) => employee.id === values.id)
      if (isExited > -1) {
        return
      }

      if (employeeInfo.name) {
        id.value++;
        employeeInfo.id = id.value
        employeeInfo.title = employeeInfo.name
        const employee: any = Object.assign({}, employeeInfo)
        employeesStore.add(employee);
        data.value.push({ key: employeeInfo.id, id: employeeInfo.id, name: employeeInfo.name } as DataTable);
        resetForm();
      }
    };
    const handleFinishFailed = (errors: any) => {
      console.log(errors);
    };
    const resetForm = () => {
      formRef.value?.resetFields();
    };
    const handleValidate = (...args: any) => {
      console.log(args);
    };

    onMounted(() => {
      if (employeesStore.employees.length) {
        data.value = employeesStore.employees.map(e => ({ key: e.id, id: e.id, name: e.name }))
      }
    });

    return {
      employeeInfo,
      formRef,
      rules,
      layout,
      columns,
      data,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
    };
  },
});
</script>

