import type { Ref } from 'vue'

export type Library = 'services' | 'clusterer' | 'drawing'

export interface KakaoLoaderOptions {
  /**
   * 카카오 Javascript App Key
   * */
  appKey: string
  /**
   * 사용하는 라이브러리 목록
   *
   * - `clusterer`: 마커를 클러스터링 할 수 있는 클러스터러 라이브러리 입니다.
   * - `services`: 장소 검색 과 주소-좌표 변환 을 할 수 있는 services 라이브러리 입니다.
   * - `drawing`: 지도 위에 마커와 그래픽스 객체를 쉽게 그릴 수 있게 그리기 모드를 지원하는 drawing 라이브러리 입니다.
   */
  libraries?: Library[]
}

type LoaderStatus = 'init' | 'loading' | 'loaded' | 'error'

declare class KakaoLoader {
  private static instance: KakaoLoader

  private static onload: (() => void)[]
  private static onerror: ((err?: string | Event) => void)[]

  readonly appKey: string
  readonly libraries: Library[]

  private status: Ref<LoaderStatus>

  constructor(options: KakaoLoaderOptions)

  static addLoadEventListener(listener: () => void)

  static addErrorEventListener(listener: (err?: string | Event) => void)

  load(): Promise<typeof kakao.maps>
}
