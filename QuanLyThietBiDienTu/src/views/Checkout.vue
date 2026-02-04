<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dữ liệu giỏ hàng (Giả lập)
const cart = ref([
  { id: 1, name: 'Thiết bị A', price: 150000, quantity: 1 },
  { id: 2, name: 'Thiết bị B', price: 300000, quantity: 2 }
])

const order = ref({
  name: '',
  address: '',
  phone: '',
  payment: 'COD'
})

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + ' ₫'

const submitOrder = () => {
  // 1. Tạo mã đơn hàng ngẫu nhiên (Ví dụ: DH1234)
  const orderId = 'DH' + Math.floor(1000 + Math.random() * 9000);

  // 2. Đóng gói thông tin đơn hàng
  const newOrder = {
    id: orderId,
    customerName: order.value.name, // Lấy tên từ form
    phone: order.value.phone,       // Lấy sđt từ form
    address: order.value.address,   // Lấy địa chỉ
    payment: order.value.payment,
    total: total.value,
    date: new Date().toISOString(), // Lưu ngày hiện tại
    status: 'Pending',              // Trạng thái mặc định: Chờ xử lý
    items: cart.value               // Lưu danh sách sản phẩm đã mua
  };

  // 3. Lấy danh sách đơn hàng cũ từ LocalStorage (nếu có)
  const existingOrders = JSON.parse(localStorage.getItem('site_orders') || '[]');

  // 4. Thêm đơn hàng mới vào đầu danh sách
  existingOrders.unshift(newOrder);

  // 5. Lưu ngược lại vào LocalStorage
  localStorage.setItem('site_orders', JSON.stringify(existingOrders));

  // 6. Thông báo và chuyển hướng
  alert(`Đặt hàng thành công! Mã đơn của bạn là: ${orderId}`);
  
  // (Tùy chọn) Xóa giỏ hàng sau khi mua (nếu dùng localStorage cho cart)
  // localStorage.removeItem('cart'); 

  router.push('/'); // Chuyển về trang chủ
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">💳 Thanh toán</h2>

    <form @submit.prevent="submitOrder" class="bg-white p-4 rounded shadow">
      <div class="mb-3">
        <label class="form-label">Họ tên người nhận</label>
        <input v-model="order.name" class="form-control" placeholder="Nhập họ tên đầy đủ" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ giao hàng</label>
        <input v-model="order.address" class="form-control" placeholder="Số nhà, đường, quận/huyện..." required />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input v-model="order.phone" class="form-control" placeholder="Ví dụ: 0912345678" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Phương thức thanh toán</label>
        <select v-model="order.payment" class="form-select">
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="BANK">Chuyển khoản ngân hàng</option>
        </select>
      </div>

      <div class="alert alert-secondary">
        <h6>Đơn hàng bao gồm:</h6>
        <ul class="mb-2 pl-3">
          <li v-for="item in cart" :key="item.id">
            {{ item.name }} x{{ item.quantity }}
          </li>
        </ul>
        <hr>
        <div class="d-flex justify-content-between fw-bold fs-5 text-primary">
          <span>Tổng tiền:</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>

      <button class="btn btn-primary w-100 py-2 fw-bold">Xác nhận thanh toán</button>
      <router-link to="/cart" class="btn btn-outline-secondary w-100 mt-2">
        Quay lại giỏ hàng
      </router-link>
    </form>
  </div>
</template>