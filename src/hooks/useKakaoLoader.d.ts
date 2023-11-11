import type { KakaoLoaderOptions } from '../utils/KakaoLoader'

declare function useKakaoLoader(options: KakaoLoaderOptions): {
  load: boolean
  error: string | Event | undefined
}
