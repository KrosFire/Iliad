import { appWindow } from '@tauri-apps/api/window'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import closeWindow from './api/closeWindow'
import App from './App.vue'
import animationsManager from './managers/animations.manager'
import settingsManager from './managers/settings.manager'

const workspacePath = window.__TAURI_METADATA__.__currentWindow.label

appWindow.onCloseRequested(async event => {
  event.preventDefault()

  closeWindow()
})

const app = createApp(App, {
  workspacePath,
})

app.use(createPinia())

settingsManager()
animationsManager()

app.mount('#app')
