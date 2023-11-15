import { ref, type Ref } from 'vue'

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

const BASE_URL = '//dapi.kakao.com/v2/maps/sdk.js'

export class KakaoLoader {
  private static instance: KakaoLoader

  private static onload: (() => void)[] = []
  private static onerror: ((err?: string | Event) => void)[] = []

  static loaded = ref(false)
  static error = ref(false)

  readonly appKey: string
  readonly libraries: Library[]

  private status: Ref<LoaderStatus> = ref('init')

  constructor(options: KakaoLoaderOptions) {
    this.appKey = options.appKey
    this.libraries = options.libraries ? [...options.libraries].sort() : []

    // singleton instance 설정
    if (KakaoLoader.instance) {
      if (!KakaoLoader.instance.equals(this)) {
        throw new Error('다른 options을 가진 KakaoLoader를 추가로 생성할 수 없습니다.')
      }
    } else {
      KakaoLoader.instance = this
    }
    return KakaoLoader.instance
  }

  static addLoadEventListener(listener: () => void) {
    this.onload.push(listener)
  }

  static addErrorEventListener(listener: (err?: string | Event) => void) {
    this.onerror.push(listener)
  }

  load(): Promise<typeof kakao.maps> {
    return new Promise((resolve, reject) => {
      if (this.status.value !== 'init') reject()

      this.status.value = 'loading'
      const script = document.createElement('script')
      script.src = this.createUrl()

      script.addEventListener('load', () => {
        this.status.value = 'loaded'
        KakaoLoader.loaded.value = true
        window.kakao.maps.load(() => {
          KakaoLoader.onload.forEach((on) => on())
        })
        resolve(window.kakao.maps)
      })
      script.addEventListener('error', (err) => {
        this.status.value = 'error'
        KakaoLoader.error.value = true
        KakaoLoader.onerror.forEach((on) => on(err))
        reject(err)
      })

      document.head.appendChild(script)
    })
  }

  private createUrl() {
    let url = BASE_URL + `?appkey=${this.appKey}`
    if (this.libraries.length) {
      url += `&libraries=${this.libraries.join(',')}`
    }
    url += '&autoload=false'
    return url
  }

  private equals(o: KakaoLoader) {
    if (this.appKey !== o.appKey) return false
    if (this.libraries.length !== o.libraries.length) return false
    for (let i = 0; i < this.libraries.length; ++i) {
      if (this.libraries[i] !== o.libraries[i]) return false
    }
    return true
  }
}
