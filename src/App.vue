<template>
  <a-layout :style="{ minHeight: '100vh' }" class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1" @click="handleChangeTab('add')">Add employee</a-menu-item>
        <a-menu-item key="2" @click="handleChangeTab('assign')">Assign supervisor</a-menu-item>
        <a-menu-item key="3" @click="handleChangeTab('search')">Search</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <FormAdd v-if="currentTab === 'add'" />
        <FormAssign v-if="currentTab === 'assign'" />
        <FormSearch v-if="currentTab === 'search'" />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Created by Khanh Le
    </a-layout-footer>
    </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import FormAdd from './components/FormAdd.vue';
import FormAssign from './components/FormAssign.vue'
import FormSearch from './components/FormSearch.vue'

export default defineComponent({
  components: {
    FormAdd,
    FormAssign,
    FormSearch,
  },
  setup() {
    const currentTab = ref('add');

    const handleChangeTab = (tab: string): void => {
      currentTab.value = tab;
    }

    return {
      selectedKeys: ref<string[]>(['1']),
      currentTab,
      handleChangeTab,
    };
  },
});
</script>
<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
