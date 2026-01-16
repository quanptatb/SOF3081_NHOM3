<template>
  <div class="container-fluid">
    <div class="container-xl px-4 mt-4">

      <h3 class="text-orange mb-3">📦 Quản lý sản phẩm</h3>

      <!-- SEARCH + ADD -->
      <div class="row g-2 mb-3 align-items-center">
        <div class="col-md-6 col-12">
          <input
            v-model="keyword"
            class="form-control"
            placeholder="🔍 Tìm kiếm sản phẩm..."
          />
        </div>
        <div class="col-md-6 col-12 text-md-end">
          <button class="btn btn-orange" @click="openAdd">
            ➕ Thêm sản phẩm
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle bg-white shadow-sm w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th class="text-center" width="220">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in filteredProducts" :key="p.id">
              <td>{{ p.id }}</td>
              <td>
                <img
                  :src="`/src/assets/images/${p.image}`"
                  width="60"
                  class="rounded"
                />
              </td>
              <td>{{ p.name }}</td>
              <td>{{ p.category }}</td>
              <td class="text-orange fw-bold">
                {{ p.price.toLocaleString() }} ₫
              </td>
              <td class="text-center">
                <!-- 👁️ QUA TRANG CHI TIẾT -->
                <button class="btn btn-sm btn-info me-1" @click="viewDetail(p.id)">
                  👁️
                </button>
                <button class="btn btn-sm btn-warning me-1" @click="openEdit(p)">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="remove(p.id)">
                  🗑️
                </button>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="text-center text-muted">
                Không tìm thấy sản phẩm
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ADD / EDIT MODAL -->
      <div v-if="showForm" class="modal fade show d-block bg-dark bg-opacity-50">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-orange text-white">
              <h5>{{ isEdit ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm' }}</h5>
              <button class="btn-close" @click="closeForm"></button>
            </div>

            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <input v-model="form.name" class="form-control" placeholder="Tên sản phẩm" />
                </div>
                <div class="col-md-6">
                  <input v-model="form.category" class="form-control" placeholder="Danh mục" />
                </div>
                <div class="col-md-6">
                  <input v-model.number="form.price" type="number" class="form-control" placeholder="Giá" />
                </div>
                <div class="col-md-6">
                  <input v-model="form.image" class="form-control" placeholder="Ảnh (vd: leica2.jpg)" />
                </div>
                <div class="col-12">
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Mô tả sản phẩm"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeForm">Hủy</button>
              <button class="btn btn-orange" @click="save">💾 Lưu</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ===================== STATE ===================== */
const keyword = ref('')
const showForm = ref(false)
const isEdit = ref(false)

const products = ref([])

const form = ref({
  id: null,
  name: '',
  category: '',
  price: null,
  image: '',
  description: ''
})

/* ===================== LOCAL STORAGE ===================== */
onMounted(() => {
  // 🔁 ĐỔI VERSION KHI THÊM / SỬA DỮ LIỆU MẪU
  const DATA_VERSION = 'v2'

  if (localStorage.getItem('products_version') !== DATA_VERSION) {
    localStorage.removeItem('products')
    localStorage.setItem('products_version', DATA_VERSION)
  }

  const data = localStorage.getItem('products')
  products.value = data
    ? JSON.parse(data)
    : [
        /* ================= CPU ================= */
        {
          id: 1,
          name: 'CPU Intel Core i5',
          category: 'CPU',
          price: 4500000,
          image: 'inteli5.png',
          description: 'CPU Intel Core i5 hiệu năng ổn định cho học tập và làm việc'
        },
        {
          id: 2,
          name: 'CPU Intel Core i7',
          category: 'CPU',
          price: 6500000,
          image: 'inteli7.png',
          description: 'CPU Intel Core i7 mạnh mẽ cho gaming và đồ họa'
        },
        {
          id: 3,
          name: 'CPU Ryzen 5',
          category: 'CPU',
          price: 4200000,
          image: 'ryzen5.png',
          description: 'CPU AMD Ryzen 5 hiệu năng cao, giá tốt'
        },
        {
          id: 4,
          name: 'CPU Ryzen 7',
          category: 'CPU',
          price: 7200000,
          image: 'ryzen7.png',
          description: 'CPU AMD Ryzen 7 cho xử lý đa nhiệm nặng'
        },

        /* ================= RAM ================= */
        {
          id: 5,
          name: 'RAM Corsair 8GB',
          category: 'RAM',
          price: 800000,
          image: 'corsair8.png',
          description: 'RAM Corsair 8GB DDR4'
        },
        {
          id: 6,
          name: 'RAM Corsair 16GB',
          category: 'RAM',
          price: 1200000,
          image: 'corsair16.png',
          description: 'RAM Corsair 16GB DDR4'
        },
        {
          id: 7,
          name: 'RAM Kingston 8GB',
          category: 'RAM',
          price: 750000,
          image: 'kingston8.png',
          description: 'RAM Kingston 8GB DDR4'
        },
        {
          id: 8,
          name: 'RAM Kingston 16GB',
          category: 'RAM',
          price: 1300000,
          image: 'kingston16.png',
          description: 'RAM Kingston 16GB DDR4'
        },

        /* ================= GPU ================= */
        {
          id: 9,
          name: 'GTX 1660',
          category: 'GPU',
          price: 4800000,
          image: 'gtx1660.png',
          description: 'Card đồ họa GTX 1660 cho gaming phổ thông'
        },
        {
          id: 10,
          name: 'RTX 3050',
          category: 'GPU',
          price: 6200000,
          image: 'rtx3050.png',
          description: 'Card đồ họa RTX 3050 hỗ trợ Ray Tracing'
        },
        {
          id: 11,
          name: 'RTX 3060',
          category: 'GPU',
          price: 7800000,
          image: 'rtx3060.png',
          description: 'Card đồ họa RTX 3060 hiệu năng cao'
        },
        {
          id: 12,
          name: 'RTX 4060',
          category: 'GPU',
          price: 9500000,
          image: 'rtx4060.png',
          description: 'Card đồ họa RTX 4060 thế hệ mới'
        },

        /* ================= SSD ================= */
        {
          id: 13,
          name: 'SSD Transcend ESD310 512GB',
          category: 'SSD',
          price: 1400000,
          image: 'trans512.png',
          description: 'SSD di động Transcend dung lượng 512GB'
        },
        {
          id: 14,
          name: 'SSD Kingston 1TB',
          category: 'SSD',
          price: 2200000,
          image: 'kingston1tb.png',
          description: 'SSD Kingston NVMe dung lượng 1TB'
        },
        {
          id: 17,
          name: 'SSD Samsung 980 500GB',
          category: 'SSD',
          price: 1650000,
          image: 'samsung980.png',
          description: 'SSD Samsung 980 NVMe dung lượng 500GB, tốc độ cao'
        },
        {
          id: 18,
          name: 'SSD Samsung 970 EVO 1TB',
          category: 'SSD',
          price: 2800000,
          image: 'samsung970.png',
          description: 'SSD Samsung 970 EVO NVMe dung lượng 1TB'
        },

        /* ================= HDD ================= */
        {
          id: 15,
          name: 'HDD WD Blue 1TB',
          category: 'HDD',
          price: 900000,
          image: 'wd1tb.png',
          description: 'Ổ cứng HDD WD Blue 1TB'
        },
        {
          id: 16,
          name: 'HDD Seagate 2TB',
          category: 'HDD',
          price: 1600000,
          image: 'seagate2tb.png',
          description: 'Ổ cứng HDD Seagate dung lượng 2TB'
        },
        {
          id: 19,
          name: 'HDD Toshiba 1TB',
          category: 'HDD',
          price: 950000,
          image: 'toshiba1tb.png',
          description: 'Ổ cứng HDD Toshiba dung lượng 1TB, bền bỉ'
        },
        {
          id: 20,
          name: 'HDD Seagate 4TB',
          category: 'HDD',
          price: 2900000,
          image: 'seagate4tb.png',
          description: 'Ổ cứng HDD Seagate dung lượng lớn 4TB'
        }
      ]
})




watch(
  products,
  () => {
    localStorage.setItem('products', JSON.stringify(products.value))
  },
  { deep: true }
)

/* ===================== COMPUTED ===================== */
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

/* ===================== ID AUTO INCREASE ===================== */
const generateId = () => {
  if (products.value.length === 0) return 1
  return Math.max(...products.value.map(p => p.id)) + 1
}

/* ===================== FORM ===================== */
const openAdd = () => {
  isEdit.value = false
  form.value = {
    id: null,
    name: '',
    category: '',
    price: null,
    image: '',
    description: ''
  }
  showForm.value = true
}

const openEdit = (p) => {
  isEdit.value = true
  form.value = { ...p }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ===================== SAVE (VALIDATE + ID) ===================== */
const save = () => {
  if (!form.value.name || !form.value.category || !form.value.image) {
    alert('⚠️ Vui lòng nhập đầy đủ thông tin')
    return
  }

  if (!form.value.price || form.value.price <= 0) {
    alert('⚠️ Giá phải lớn hơn 0')
    return
  }

  if (isEdit.value) {
    const index = products.value.findIndex(p => p.id === form.value.id)
    products.value[index] = { ...form.value }
  } else {
    form.value.id = generateId()
    products.value.push({ ...form.value })
  }

  closeForm()
}

/* ===================== REMOVE ===================== */
const remove = (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    products.value = products.value.filter(p => p.id !== id)
  }
}

/* ===================== DETAIL ===================== */
const viewDetail = (id) => {
  router.push(`/admin/products/${id}`)
}

</script>

<style scoped>
.text-orange { color: #ff7a00; }
.bg-orange { background-color: #ff7a00; }
.btn-orange { background-color: #ff7a00; color: #fff; }
.btn-orange:hover { background-color: #e56d00; }

table { min-width: 900px; }
</style>
