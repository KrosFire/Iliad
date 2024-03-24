import { PAGES } from '~/types'
import { Component, defineAsyncComponent } from 'vue'

const pages: Readonly<Record<PAGES, Component>> = {
  StartingPage: defineAsyncComponent(() => import('./StartingPage.vue')),
  SettingsPage: defineAsyncComponent(() => import('./SettingsPage.vue')),
}

export default pages
