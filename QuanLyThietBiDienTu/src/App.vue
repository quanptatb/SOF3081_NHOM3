<script setup>
  import AdminLayout from './features/admin/layouts/AdminLayout.vue';
</script>

<template>
  <AdminLayout>
    <template #default>
      <slot></slot>
    </template>
  </AdminLayout>
</template>

<style scoped></style>
