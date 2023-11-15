import type { LatLng } from '@/types/LatLng'
import { inject, type Ref } from 'vue'

export function useMarker(component?: string) {
  const context = inject<{ marker?: Ref<kakao.maps.Marker>; position?: Ref<LatLng> }>('marker', {
    marker: undefined,
    position: undefined
  })
  return context
}
