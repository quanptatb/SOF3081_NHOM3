import { createApp } from 'vue'
import { products } from '@/data/products'
import { computed } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'

// CSS
import './assets/base.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
createApp(App)
  .use(router)
  .mount('#app')
