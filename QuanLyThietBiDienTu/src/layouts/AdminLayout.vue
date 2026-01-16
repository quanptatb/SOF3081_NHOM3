<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar -->
    <aside class="bg-dark text-white p-3" style="width: 240px">
      <h5 class="fw-bold mb-4">Admin Panel</h5>
      <ul class="nav flex-column gap-2">
        <li class="nav-item">
          <a class="nav-link text-white active" href="#">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" href="#">Quản lý người dùng</a>
        </li>
        <router-link to="/admin/products" class="btn btn-outline-light me-2">
          Quản lý thiết bị
        </router-link>
        <router-link to="/" class="btn btn-outline-light me-2">
          Sản phẩm
        </router-link>

        <router-link to="/cart" class="btn btn-outline-light me-2">
          Giỏ hàng
        </router-link>
        <router-link to="/checkout" class="btn btn-outline-warning">
          Thanh toán
        </router-link>
      </ul>
    </aside>

    <!-- Main -->
    <div class="flex-fill">
      <!-- Header -->
      <header class="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <strong>SD21305 - NoName</strong>
        <button class="btn btn-sm btn-danger">Đăng xuất</button>
      </header>

      <!-- Content -->
      <main class="p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.nav-link.active {
  background-color: #0d6efd;
  border-radius: 6px;
}
</style>