import { KakaoLoader, type KakaoLoaderOptions } from '@/utils/KakaoLoader'

export function useKakaoLoader(options: KakaoLoaderOptions) {
  new KakaoLoader(options).load()

  return { loaded: KakaoLoader.loaded, error: KakaoLoader.error }
}
