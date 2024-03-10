import { appWindow } from '@tauri-apps/api/window'
import ace from 'ace-builds'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import closeWindow from './api/closeWindow'
import App from './App.vue'
import animationsManager from './managers/animations.manager'
import settingsManager from './managers/settings.manager'

import './index.css'

ace.require('ace-builds/src-noconflict/ext-language_tools')
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict/')

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
