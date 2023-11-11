import { KakaoLoader } from '@/utils/KakaoLoader'
import { reactive } from 'vue'

export function useKakaoLoader(options) {
  const state = reactive({
    load: false,
    error: undefined
  })
  new KakaoLoader(options)
    .load()
    .then(() => (state.load = true))
    .catch((err) => (state.error = err))

  return state
}
