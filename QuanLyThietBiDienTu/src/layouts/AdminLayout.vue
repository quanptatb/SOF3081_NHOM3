<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar -->
    <aside class="sidebar bg-dark text-white p-3">
      <h5 class="fw-bold mb-4 text-center">Admin Panel</h5>

      <ul class="nav flex-column gap-1">
        <li class="nav-item">
          <router-link to="/admin" class="nav-link" active-class="active">
            📊 Dashboard
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/admin/users" class="nav-link" active-class="active">
            👤 Người dùng
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/admin/products" class="nav-link" active-class="active">
            💻 Thiết bị
          </router-link>
        </li>

        <hr class="text-secondary" />

        <li class="nav-item">
          <router-link to="/" class="nav-link">
            🛒 Sản phẩm
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/cart" class="nav-link">
            🧺 Giỏ hàng
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/checkout" class="nav-link text-warning fw-semibold">
            💳 Thanh toán
          </router-link>
        </li>
      </ul>
    </aside>

    <!-- Main -->
    <div class="flex-fill d-flex flex-column">
      <!-- Header -->
      <header class="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
        <strong>SD21305 - NoName</strong>
        <button class="btn btn-sm btn-danger">Đăng xuất</button>
      </header>

      <!-- Content -->
      <main class="p-4 flex-fill bg-light">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.sidebar {
  width: 230px;
}

.nav-link {
  color: #dee2e6;
  border-radius: 6px;
  padding: 8px 12px;
  transition: 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.nav-link.active {
  background-color: #0d6efd;
  color: #fff;
  font-weight: 500;
}
</style>
