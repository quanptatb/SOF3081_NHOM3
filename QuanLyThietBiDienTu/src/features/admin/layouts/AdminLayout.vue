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
        <li class="nav-item">
          <a class="nav-link text-white" href="#">Quản lý thiết bị</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" href="#">Sản Phẩm</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white" href="#">Đơn hàng</a>
        </li>
      </ul>
    </aside>

    <!-- Main -->
    <div class="flex-fill">
      <!-- Header -->
      <header class="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <strong>Dashboard</strong>
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