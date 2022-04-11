<template>
  <a-input-search v-model:value="keyword" placeholder="Enter keywords..." size="large" enter-button class="input-search"
    @search="handleSearch" @keydown.enter="handleSearch" />
  <a-tree v-if="treeData.length && !notFound" :tree-data="treeData" defaultExpandAll autoExpandParent />
  <a-empty v-if="notFound" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useEmployeesStore } from '../stores/index';
import { Employees } from '../types'


export default defineComponent({
  setup() {
    const employeesStore = useEmployeesStore();
    const employees = ref(employeesStore.employees);
    const keyword = ref('');
    const treeData: any = ref([]);
    const notFound = ref(false);


    const buildTree = (list: any) => {
      const map: any = {};
      const roots = [];
      let node: Employees;
      let i: number;

      for (i = 0; i < list.length; i++) {
        map[list[i].id] = i;
        list[i].children = [];
      }

      for (i = 0; i < list.length; i++) {
        node = list[i];
        if (node.supervised_by && list[map[node.supervised_by]]) {
          list[map[node.supervised_by]].children.push(node);
        } else {
          roots.push(node as never);
        }
      }

      return roots;
    }
    const handleSearch = () => {
      notFound.value = false
      const employee = employees.value.find(e => e.name.toLowerCase() === keyword.value.toLowerCase())
      if (!employee) {
        notFound.value = true
        return;
      }

      let tree: Array<Employees> = []
      if (!employee.supervised_by) {
        tree.push(employee);
      } else {
        tree = employees.value.filter(item => item.supervised_by !== employee.id);
      }

      treeData.value = buildTree(tree);
    }

    return {
      keyword,
      treeData,
      notFound,
      handleSearch,
    };
  },
});
</script>

<style>
.input-search {
  margin-bottom: 40px;
}
</style>