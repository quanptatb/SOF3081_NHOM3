<template>
  <div class="card mx-auto shadow" style="max-width: 400px;">
    <div class="card-body">
      <h3 class="card-title text-center mb-4">Đăng Ký</h3>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Họ tên</label>
          <input v-model="form.name" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="form.password" type="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Đăng ký</button>
      </form>
      <div class="mt-3 text-center">
        <router-link to="/login">Đã có tài khoản? Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ name: '', email: '', password: '', role: 'user' });

const handleRegister = () => {
  // Lấy danh sách user cũ từ localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Kiểm tra email tồn tại
  if (users.find(u => u.email === form.email)) {
    alert('Email đã tồn tại!');
    return;
  }

  // Thêm user mới (giả lập ID)
  const newUser = { ...form, id: Date.now() };
  users.push(newUser);
  
  // Lưu lại vào localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  alert('Đăng ký thành công!');
  router.push('/login');
};
</script>