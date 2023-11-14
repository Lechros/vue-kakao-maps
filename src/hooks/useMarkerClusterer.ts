import { inject } from 'vue'

export function useMarkerClusterer(component) {
  const context = inject('clusterer', undefined)
  return context?.clusterer
}
