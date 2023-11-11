import { KakaoLoaderOptions } from './../utils/KakaoLoader'
import { reactive } from 'vue'
import { KakaoLoader } from '@/utils/KakaoLoader'

export function useKakaoLoader(options: KakaoLoaderOptions): {
  load: boolean
  error: string | Event | undefined
} {
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
