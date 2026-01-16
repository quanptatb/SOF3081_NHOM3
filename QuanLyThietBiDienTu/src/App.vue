<template>
  <div>
    <nav class="navbar navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="#">SOF308</a>

      <div>
        <router-link to="/cart" class="btn btn-outline-light me-2">
          Giỏ hàng
        </router-link>
        <router-link to="/checkout" class="btn btn-outline-warning">
          Thanh toán
        </router-link>
      </div>
    </nav>

    <router-view />
  </div>
<script setup>
  import AdminLayout from './features/admin/layouts/AdminLayout.vue';
</script>

<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>

<script setup>
</script>

<style>
body {
  background-color: #f5f5f5;
}
</style>
