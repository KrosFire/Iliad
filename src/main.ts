import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import animationsManager from './managers/animations.manager'
import settingsManager from './managers/settings.manager'

const app = createApp(App)

app.use(createPinia())

settingsManager()
animationsManager()

app.mount('#app')
