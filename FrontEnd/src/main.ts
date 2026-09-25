import '@quasar/extras/material-icons/material-icons.css'
import { createApp } from 'vue'
import { Quasar, Notify, Dialog } from 'quasar'
import App from './App.vue'
import router from './router.ts'
import './style.css'

// Opcional: Adicione os estilos css do Quasar caso ainda não tenha feito
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  }
})

app.mount('#app')
