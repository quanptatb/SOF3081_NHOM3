<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-purple">
        <i class="bi bi-people-fill me-2"></i>Quản lý người dùng
      </h2>
      <div class="search-box">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-start-0 ps-0" 
            placeholder="Tìm kiếm theo tên hoặc email..."
          >
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 rounded-3">
      <div class="card-body p-0">
        <table class="table table-hover mb-0 align-middle">
          <thead class="bg-light text-secondary">
            <tr>
              <th class="ps-4">ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th class="text-end pe-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="user.id || index">
              <td class="ps-4 text-muted">#{{ user.id ? user.id.toString().slice(-4) : index + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-circle me-3">
                    {{ getInitials(user.name) }}
                  </div>
                  <span class="fw-semibold">{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['badge rounded-pill', user.role === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success']">
                  {{ user.role === 'admin' ? 'Admin' : 'Khách hàng' }}
                </span>
              </td>
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(user)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteUser(user)"
                  :disabled="user.role === 'admin' && user.email === 'admin@gmail.com'" 
                  title="Không thể xóa Admin gốc"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                Không tìm thấy người dùng nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content p-4 rounded-3 shadow">
          <div class="d-flex justify-content-between mb-3">
            <h4 class="fw-bold">Chỉnh sửa thông tin</h4>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          
          <form @submit.prevent="saveUser">
            <div class="mb-3">
              <label class="form-label">Họ tên</label>
              <input v-model="editingUser.name" type="text" class="form-control" required>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Email (Không thể sửa)</label>
              <input v-model="editingUser.email" type="email" class="form-control bg-light" disabled>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Vai trò</label>
              <select v-model="editingUser.role" class="form-select">
                <option value="user">Khách hàng (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-light" @click="closeModal">Hủy</button>
              <button type="submit" class="btn btn-purple text-white">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// State
const users = ref([]);
const searchQuery = ref('');
const showModal = ref(false);
const editingUser = ref({});

// Load Users from LocalStorage
onMounted(() => {
  const storedUsers = localStorage.getItem('users');
  
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  } else {
    // Seed data giả nếu chưa có (để bạn test cho đẹp)
    users.value = [
      { id: 1, name: 'Admin Quân', email: 'admin@gmail.com', role: 'admin', password: '123' },
      { id: 2, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'user', password: '123' },
      { id: 3, name: 'Trần Thị B', email: 'b@gmail.com', role: 'user', password: '123' },
    ];
    localStorage.setItem('users', JSON.stringify(users.value));
  }
});

// Computed: Filter users
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  );
});

// Helper: Get Initials for Avatar
const getInitials = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

// Action: Delete User
const deleteUser = (userToDelete) => {
  if (confirm(`Bạn có chắc chắn muốn xóa user: ${userToDelete.name}?`)) {
    users.value = users.value.filter(u => u.email !== userToDelete.email);
    updateLocalStorage();
  }
};

// Action: Open Modal
const openEditModal = (user) => {
  editingUser.value = { ...user }; // Copy object để không sửa trực tiếp vào list khi chưa Lưu
  showModal.value = true;
};

// Action: Close Modal
const closeModal = () => {
  showModal.value = false;
  editingUser.value = {};
};

// Action: Save User
const saveUser = () => {
  const index = users.value.findIndex(u => u.email === editingUser.value.email);
  if (index !== -1) {
    users.value[index] = { ...editingUser.value }; // Cập nhật lại thông tin
    updateLocalStorage();
    alert("Cập nhật thành công!");
    closeModal();
  }
};

// Helper: Sync to LocalStorage
const updateLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(users.value));
};
</script>

<style scoped>
/* Màu tím chủ đạo */
.text-purple {
  color: #5a32a3;
}
.btn-purple {
  background-color: #5a32a3;
  transition: all 0.2s;
}
.btn-purple:hover {
  background-color: #482585;
}

/* Avatar Circle */
.avatar-circle {
  width: 40px;
  height: 40px;
  background-color: #e9ecef;
  color: #5a32a3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Search Box */
.search-box {
  width: 300px;
}
.input-group-text {
  background: transparent;
}

/* Custom Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  width: 400px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>