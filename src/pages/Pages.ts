import { Component, defineAsyncComponent } from 'vue'

const pages: Readonly<Record<string, Component>> = {
  StartingPage: defineAsyncComponent(() => import('./StartingPage.vue')),
}

export default pages
