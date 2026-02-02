<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Quản Lý Đơn Hàng</h1>

    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">Mã Đơn</th>
            <th scope="col" class="px-6 py-3">Khách Hàng</th>
            <th scope="col" class="px-6 py-3">Tổng Tiền</th>
            <th scope="col" class="px-6 py-3">Ngày Đặt</th>
            <th scope="col" class="px-6 py-3">Trạng Thái</th>
            <th scope="col" class="px-6 py-3">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">#{{ order.id }}</td>
            <td class="px-6 py-4">{{ order.customerName }}</td>
            <td class="px-6 py-4">{{ formatCurrency(order.total) }}</td>
            <td class="px-6 py-4">{{ formatDate(order.date) }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded text-white text-xs">
                {{ order.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button 
                v-if="order.status === 'Pending'"
                @click="confirmOrder(order.id)"
                class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
              >
                Xác nhận
              </button>
              <span v-else class="text-green-600 font-semibold text-xs">Đã xử lý</span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="orders.length === 0" class="text-center py-8">
        Chưa có đơn hàng nào cần xử lý.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. Giả lập dữ liệu (Thực tế bạn sẽ gọi API ở đây)
const orders = ref([
  { id: 'DH001', customerName: 'Nguyễn Văn A', total: 500000, date: '2023-10-25', status: 'Pending' },
  { id: 'DH002', customerName: 'Trần Thị B', total: 1200000, date: '2023-10-24', status: 'Confirmed' },
  { id: 'DH003', customerName: 'Lê Văn C', total: 750000, date: '2023-10-26', status: 'Pending' },
]);

// 2. Hàm xử lý xác nhận đơn hàng
const confirmOrder = (orderId) => {
  // Tìm đơn hàng trong mảng
  const order = orders.value.find(o => o.id === orderId);
  
  if (order) {
    if (confirm(`Bạn có chắc muốn xác nhận đơn hàng #${orderId}?`)) {
      // Cập nhật trạng thái (Trong thực tế, chỗ này bạn sẽ gọi API PUT/PATCH)
      order.status = 'Confirmed';
      
      // TODO: Gọi API cập nhật backend tại đây
      // await axios.put(`/api/orders/${orderId}`, { status: 'Confirmed' });
      
      alert('Đã xác nhận đơn hàng thành công!');
    }
  }
};

// Helper: Format tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Helper: Format ngày tháng
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Helper: Màu sắc trạng thái
const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return 'bg-yellow-500';
    case 'Confirmed': return 'bg-green-500';
    case 'Cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Fetch data khi component được load
onMounted(() => {
  // fetchOrders(); // Gọi hàm lấy dữ liệu từ API
});
</script>