<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="Select employee" v-bind="validateInfos.employeeId">
      <a-select v-model:value="modelRef.employeeId"
        placeholder="Please select your employee and make sure employee created.">
        <a-select-option v-for="employee in employees" :key="employee.id" :value="employee.id"
          :disabled="employee.id === modelRef.supervisorId">{{
            employee.name
          }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Select supervisor" v-bind="validateInfos.supervisorId">
      <a-select v-model:value="modelRef.supervisorId"
        placeholder="Please select your employee and make sure employee created.">
        <a-select-option v-for="employee in employees" :key="employee.id" :value="employee.id"
          :disabled="employee.id === modelRef.employeeId">{{
            employee.name
          }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click.prevent="onSubmit">Assign</a-button>
      <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="data" :pagination="false" bordered>
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        {{ text }}
      </template>
    </template>
    <template #title>Supervisor list</template>
    </a-table>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, ref, Ref } from 'vue';
import { Form, notification } from 'ant-design-vue';
import { useEmployeesStore } from '../stores/index';
import { DataTable, Employees } from '../types'

const useForm = Form.useForm;
export default defineComponent({
  setup() {
    const employeesStore = useEmployeesStore();
    const employees = ref(employeesStore.employees);
    const data: Ref<Array<DataTable>> = ref([]);
    const modelRef = reactive({
      employeeId: undefined,
      supervisorId: undefined,
    });
    const rulesRef = reactive({
      employeeId: [{
        required: true,
        message: 'Please select employee',
      }],
      supervisorId: [{
        required: true,
        message: 'Please select supervisor',
      }],
    });
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Supervised by',
      dataIndex: 'supervised_by',
    }];

    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

    const openNotificationWithIcon = (type: string) => {
      notification[type]({
        message: 'Assign successfully',
      });
    };

    const getSupervisorNameById = (id: string | number) => {
      if (!id) {
        return '';
      }

      return employees.value.find((employee: Employees) => employee.id === id)?.name || ''
    }

    const handleRenderSupervisor = () => {
      if (employees.value.length) {
        data.value = employees.value.map((employee: Employees) => {
          const supervisorName = getSupervisorNameById(employee.supervised_by);
          return ({ key: employee.id, name: employee.name, supervised_by: supervisorName } as DataTable)
        })
      }
    }

    const onSubmit = () => {
      validate().then((res) => {
        if (modelRef.employeeId === modelRef.supervisorId) {
          return;
        }

        employeesStore.assign(res);
        handleRenderSupervisor();
        resetFields();
        openNotificationWithIcon('success');
      }).catch(err => {
        console.log('error', err);
      });
    };

    onMounted(() => {
      handleRenderSupervisor();
    });

    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      validateInfos,
      modelRef,
      employees,
      columns,
      data,
      onSubmit,
      resetFields,
    };
  },
});
</script>

