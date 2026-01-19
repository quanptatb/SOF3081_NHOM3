<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý Người dùng</h2>
      <button class="btn btn-primary" @click="openModal('add')">
        + Thêm mới
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-info'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openModal('edit', user)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">Xóa</button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center">Chưa có dữ liệu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="fixed-overlay">
      <div class="card p-4" style="width: 400px;">
        <h4>{{ isEdit ? 'Cập nhật User' : 'Thêm User mới' }}</h4>
        <form @submit.prevent="saveUser">
          <div class="mb-2">
            <label>Họ tên</label>
            <input v-model="formData.name" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Email</label>
            <input v-model="formData.email" type="email" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Mật khẩu</label>
            <input v-model="formData.password" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Vai trò</label>
            <select v-model="formData.role" class="form-select">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="showForm = false">Hủy</button>
            <button type="submit" class="btn btn-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const users = ref([]);
const showForm = ref(false);
const isEdit = ref(false);
const formData = reactive({ id: null, name: '', email: '', password: '', role: 'user' });

// Load dữ liệu từ localStorage
const loadUsers = () => {
  const data = localStorage.getItem('users');
  users.value = data ? JSON.parse(data) : [];
};

// Mở form
const openModal = (mode, user = null) => {
  isEdit.value = mode === 'edit';
  showForm.value = true;
  if (mode === 'edit' && user) {
    Object.assign(formData, user);
  } else {
    // Reset form
    Object.assign(formData, { id: null, name: '', email: '', password: '', role: 'user' });
  }
};

// Lưu User (Thêm hoặc Sửa)
const saveUser = () => {
  if (isEdit.value) {
    // Logic cập nhật
    const index = users.value.findIndex(u => u.id === formData.id);
    if (index !== -1) users.value[index] = { ...formData };
  } else {
    // Logic thêm mới
    const newUser = { ...formData, id: Date.now() };
    users.value.push(newUser);
  }
  
  // Lưu vào localStorage
  localStorage.setItem('users', JSON.stringify(users.value));
  showForm.value = false;
  alert('Thành công!');
};

// Xóa User
const deleteUser = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa?')) {
    users.value = users.value.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users.value));
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.fixed-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>