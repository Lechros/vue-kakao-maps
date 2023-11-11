import { inject } from 'vue'

export function useMarker(component) {
  const context = inject('marker', undefined)
  return context?.marker
}
