<template>
  <div class="card mx-auto shadow" style="max-width: 400px;">
    <div class="card-body">
      <h3 class="card-title text-center mb-4">Đăng Nhập</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="password" type="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-success w-100">Đăng nhập</button>
      </form>
      <div class="mt-3 text-center">
        <router-link to="/register">Chưa có tài khoản? Đăng ký</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminAccount = { email: 'admin@gmail.com', password: '123', name: 'Admin', role: 'admin' }; // Tài khoản admin mặc định
  
  // Gộp admin cứng và user trong local để check
  const allUsers = [...users, adminAccount];

  const user = allUsers.find(u => u.email === email.value && u.password === password.value);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Đăng nhập thành công!');
    if(user.role === 'admin') router.push('/admin/users');
    else router.push('/');
  } else {
    alert('Sai email hoặc mật khẩu!');
  }
};
</script>