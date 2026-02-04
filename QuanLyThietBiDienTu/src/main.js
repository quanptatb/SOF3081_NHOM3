import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bỏ dòng import bootstrap cũ đi
// import 'bootstrap/dist/css/bootstrap.min.css' <--- XÓA hoặc comment
// import 'bootstrap'                             <--- XÓA hoặc comment

// Chỉ giữ lại CSS riêng của bạn (nếu có)
import './assets/base.css'

const app = createApp(App)

app.use(router)

app.mount('#app')