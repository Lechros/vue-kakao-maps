import { inject, type Ref } from 'vue'

export function useMarkerClusterer(component: string) {
  const context = inject<{ clusterer?: Ref<kakao.maps.MarkerClusterer>; count?: Ref<number> }>(
    'clusterer',
    { clusterer: undefined, count: undefined }
  )
  return context
}
