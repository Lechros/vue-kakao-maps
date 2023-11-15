import { inject, type Ref } from 'vue'

export function useMarker(component?: string) {
  const context = inject<{ marker: Ref<kakao.maps.Marker> } | undefined>('marker', undefined)
  return context?.marker
}
