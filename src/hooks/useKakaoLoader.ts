import { KakaoLoader, type KakaoLoaderOptions } from '../utils/KakaoLoader'
import { reactive } from 'vue'

export function useKakaoLoader(options: KakaoLoaderOptions) {
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
