import { inject, type Ref } from 'vue'

export function useMap(component: string) {
  const context = inject<{ map: Ref<kakao.maps.Map> }>('map')
  if (!context) {
    throw new Error(component + ': useMap은 KakaoMap 컴포넌트 내부에서 사용해야 합니다.')
  }
  return context.map
}
