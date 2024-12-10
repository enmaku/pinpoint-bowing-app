import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useBowlingStore } from './bowling-store'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // Initialize the bowling store
  const bowlingStore = useBowlingStore(pinia)
  bowlingStore.initializeStore()

  // Save state when the page is about to unload
  window.addEventListener('beforeunload', () => {
    bowlingStore.saveState()
  })

  return pinia
})
